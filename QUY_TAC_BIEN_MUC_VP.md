# TÀI LIỆU QUY CHUẨN: BIÊN MỤC & XUẤT EXCEL TÀI LIỆU VĂN PHÒNG (VP / UBND)

> **Mã kỹ năng hệ thống:** `bienmuc-checker`  
> **Lưu trữ tại:** `.agents/skills/bienmuc-checker/SKILL.md` & `~/.gemini/config/skills/bienmuc-checker/SKILL.md`  
> **Module xuất Excel:** `lib/excel-export-vp.js` & `scripts/export_excel_vp.js`  
> **Module đồng bộ Tài liệu loại:** `lib/tai-lieu-loai-sync.js`  
> **File Tài liệu loại dùng chung:** `C:\Users\Toan\Downloads\BienMuc_Phu_Loc_ch_check\Da_check\Tl_loại_VP_Toàn_PL.xlsx`

Tài liệu này tổng hợp toàn bộ quy chuẩn bóc tách, quy tắc nghiệp vụ lưu trữ, xử lý tài liệu loại và cơ chế xuất file Excel từ file JSON chuẩn theo đúng định dạng của hệ thống `bienmuc`.

---

## 1. CẤU TRÚC DỮ LIỆU ĐẦU RA CHUẨN (EXCEL-COMPATIBLE JSON SCHEMA)

Mỗi khi xuất dữ liệu JSON để phục vụ lưu trữ hoặc chuyển đổi sang bảng tính Excel, bắt buộc đóng gói dưới dạng **Dossier Root Object**:

```json
{
  "donViCapTren": "Ủy ban nhân dân huyện Định Quán",
  "donVi": "Ủy ban nhân dân xã Phú Lợi",
  "soKyHieuHoSo": "01",
  "tenHoSo": "Tiêu đề hồ sơ đầy đủ...",
  "tieuDeNghiQuyet": "Tiêu đề hồ sơ đầy đủ...",
  "namGiaiDoan": "2024",
  "thoiGianHoSo": "Từ ngày 05/01/2024 đến ngày 31/12/2024",
  "tongSoToText": "Bản mục lục này gồm 05 văn bản, 15 tờ",
  "thbq": "Vĩnh viễn",
  "banTo": "Văn phòng",
  "tapSo": "01",
  "rows": [
    {
      "soTT": "1",
      "soKyHieuVanBan": "12/QĐ-UBND",
      "ngayThangVanBan": "15/04/2024",
      "tenLoaiTrichYeu": "Quyết định về việc giao dự toán thu, chi ngân sách xã Phú Lợi năm 2024",
      "tacGiaVanBan": "UBND xã Phú Lợi",
      "toSoTrangSo": "01-03",
      "loaiBan": "Bản gốc",
      "ghiChu": ""
    }
  ],
  "rowsTrung": []
}
```

---

## 2. 9 NGUYÊN TẮC BÓC TÁCH VÀNG

### 1. Xử lý Ảnh đầu tiên (Bìa hồ sơ) & Ảnh cuối cùng (Tờ chốt ghim bấm)
- **Tấm ảnh đầu tiên (`001.jpg`):** Bìa ngoài hồ sơ $\rightarrow$ Bỏ qua khỏi bảng mục lục (`status: "skip"`, `isExcluded: true`), chỉ dùng để trích xuất tiêu đề hồ sơ, cơ quan ban hành, năm giai đoạn.
- **Tấm ảnh cuối cùng:**
  - **Trường hợp A (Tài liệu nhiều tờ có ghim bấm / phụ lục đính kèm):**
    - Nhìn góc trên bên trái của ảnh tài liệu kế cuối có **vết bấm ghim**, hoặc ảnh cuối là bảng biểu/phụ lục đính kèm "(Kèm theo...)" $\rightarrow$ Bỏ qua ảnh cuối (`status: "skip"`, `isExcluded: true`).
    - Lấy số tờ của ảnh cuối đó gán làm số kết thúc của tài liệu kế cuối (VD: `27` và `36` $\rightarrow$ gộp thành dải `27-36`).
  - **Trường hợp B (Tài liệu độc lập riêng biệt):** Xử lý như một văn bản bình thường.

### 2. Nhận diện & Đồng bộ Tài liệu Loại ("Trùng" hoặc "Photo" ghi trên trang)
- **Dấu hiệu:** Mép trên hoặc ở chỗ số trang có ghi chữ viết tay/dấu đóng: **`"trùng"`** hoặc **`"photo"`**.
- **Xử lý với hồ sơ hiện tại:** Bỏ qua khỏi hồ sơ (`status: "skip"`, `isExcluded: true`), **KHÔNG** đưa vào file biên mục / file Excel của hồ sơ đó.
- **Đồng bộ vào file `Tl_loại_VP_Toàn_PL.xlsx`:**
  - Nếu là **Photo:** Thêm vào Sheet `Photo` $\rightarrow$ Cột Tiêu đề ghi tên văn bản, THBQ = `"Vĩnh viễn"`, Lý do huỷ = `"Không có giá trị"`, Ghi chú = `"Photo"`.
  - Nếu là **Trùng:** Thêm vào Sheet `Trùng` $\rightarrow$ Cột Tiêu đề ghi tên văn bản, THBQ = `"Vĩnh viễn"`, Cột Lý do huỷ ghi rõ: **`Trùng hs [Mã_hồ_sơ]`** (VD: `Trùng hs PL_2023_23F`).

### 3. Tác giả văn bản (`tacGiaVanBan`)
- **Lấy tại:** Khối chữ in hoa góc trên bên trái, **trước dòng `Số:...`**.
- **Luật đa cấp:** Nếu có 2–3 dòng xếp chồng (cấp trên + đơn vị trực thuộc) $\rightarrow$ Ghép đầy đủ nối bằng `\n` hoặc `" - "` (VD: `UBND xã Phú Lộc - Tổ lấy ý kiến cấp xã`).
- **CẤM:** Không lấy từ con dấu đỏ *"ĐẾN"*, không lấy từ dòng chức danh người ký giữa trang, không lấy phần *"Nơi nhận:"*.

### 4. Số ký hiệu văn bản (`soKyHieuVanBan`)
- Lấy từ dòng `Số:...`.
- Bỏ chữ `Số:`, gọt sạch khoảng trắng quanh dấu `/` và dấu `-`.
- Nếu không có số hiệu (Giấy mời, Bản dự thảo có dấu DỰ THẢO) $\rightarrow$ để trống `""`.

### 5. Ngày tháng văn bản (`ngayThangVanBan`)
- **CHỈ lấy** ngày in ở phần đầu văn bản (dưới quốc hiệu góc phải hoặc cạnh dòng Số).
- **CẤM:** Không lấy ngày trong câu *"Hôm nay, ngày..."*, ngày trong các căn cứ pháp lý, ngày ký của lãnh đạo ở cuối trang.
- **Định dạng bắt buộc:** `dd/mm/yyyy`. Nếu không có ở đầu trang $\rightarrow$ để trống `""`.

### 6. Tên loại & Trích yếu (`tenLoaiTrichYeu`)
- Chuẩn hóa `"V/v:"`, `"V/v"`, `"Về việc"` thành `"về việc"` viết thường.
- Nếu văn bản **không có chữ "về việc"** $\rightarrow$ Giữ nguyên tên loại + nội dung, **tuyệt đối không tự ý chèn thêm "về việc"**.
- Cấm tự tiện chèn chữ "Công văn" nếu bản gốc không ghi.
- **BỔ SUNG TÊN NGƯỜI (BẮT BUỘC):** Đọc phần thân văn bản dưới tiêu đề (*"Xét đề nghị...", "Căn cứ...", "Điều 1...", "Kính mời..."*) tìm tên cá nhân kèm chức danh (`đ/c`, `ông`, `bà`) $\rightarrow$ nối vào cuối trích yếu sau dấu phẩy.

### 7. Số tờ / Trang số (`toSoTrangSo`)
- **CHỈ lấy số viết tay (bút chì, bút bi) ở lề trên trang** (thường ở góc trên phải hoặc giữa mép trên).
- Hỗ trợ số đơn (`01`), số kèm chữ (`182a`), khoảng tờ (`01-08`, `27-36`).
- **Tự động suy luận dải tờ:** Khi nhập số đơn liên tục (`01`, `09`, `20`), bộ máy xuất Excel tự động mở rộng thành dải tờ chuẩn (`01-08`, `09-19`).
- **CẤM:** Không lấy số văn bản, số điều khoản, ngày tháng.

### 8. Loại bản (`loaiBan`)
- Mặc định là `"Bản gốc"` cho mọi ảnh scan hồ sơ.
- Chỉ gán `"Bản chính"` khi có dập in chữ "BẢN CHÍNH".
- Các giá trị khác: `"Bản gốc không mộc"`, `"Photo"`.

### 9. Cột Ghi chú (`ghiChu`) — Tối giản, không thêm nội dung rườm rà
- **Tuyệt đối không tự ý thêm các diễn giải giải thích nội bộ** vào cột ghi chú.
- **Mặc định để trống `""`**.
- **Chỉ ghi độ mật:** `"Tuyệt mật"` hoặc `"Mật"` khi có con dấu độ mật.

---

## 3. CÁCH XUẤT EXCEL TỪ FILE JSON

Sử dụng trực tiếp script CLI trong dự án:

```bash
# Cú pháp:
npm run export:excel -- <file_json> [file_xuat.xlsx]
```
