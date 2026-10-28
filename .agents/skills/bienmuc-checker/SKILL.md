---
name: bienmuc-checker
description: Quy chuẩn đối chiếu, soát lỗi (double-check), trích xuất biên mục và xuất file Excel tài liệu lưu trữ các khối Văn phòng (VP), Kế toán (KT), và Văn hóa - Xã hội (VHXH / NTM). Hỗ trợ cả 2 chế độ: (1) Double-check file OCR thô và (2) Direct AI Vision đọc trực tiếp ảnh scan khi chưa có file OCR. Tự động bóc tách số hiệu, tác giả, ngày tháng, trích yếu, xử lý dải số tờ liên tục 01-N, bóc tách bìa 2 lớp, gộp tập ảnh minh chứng NTM, và đồng bộ file tài liệu loại theo chuẩn thể thức văn bản lưu trữ Việt Nam.
---

# KỸ NĂNG SOÁT LỖI, BIÊN MỤC & XUẤT EXCEL TÀI LIỆU LƯU TRỮ (VP / KT / VHXH)

Kỹ năng này định nghĩa toàn bộ quy chuẩn nghiệp vụ, quy tắc bóc tách, quy trình **Double-Check (Soát lỗi đối chiếu)** và **Direct AI Vision (Bóc tách trực tiếp từ ảnh scan)** cho các khối tài liệu lưu trữ: **Văn phòng (VP)**, **Kế toán (KT)** và **Văn hóa - Xã hội (VHXH / Chuyên đề Nông thôn mới)**, chuẩn định dạng JSON tương thích 100% với hệ thống xuất Excel 8 cột lưu trữ và cơ chế đồng bộ tài liệu loại dùng chung.

---

## 1. MỤC ĐÍCH & PHẠM VI ÁP DỤNG
- **Phạm vi áp dụng:**
  - **Khối Văn phòng (VP / UBND):** Tập lưu văn bản đi/đến, Quyết định, Kế hoạch, Báo cáo, Tờ trình theo từng năm. `banTo: "Văn phòng"`.
  - **Khối Kế toán (KT):** Dự toán, quyết toán ngân sách xã, báo cáo tài chính, chứng từ rút vốn, công trình hạ tầng. `banTo: "Kế toán"`.
  - **Khối Văn hóa - Xã hội (VHXH):** Hồ sơ chuyên đề (Xây dựng xã đạt chuẩn Nông thôn mới / NTM nâng cao, Y tế, Giáo dục, Lao động - TBXH, Văn hóa thể thao). `banTo: "Văn hóa - Xã hội"`.
- **Hai chế độ hoạt động linh hoạt:**
  - **Chế độ 1 - Double-Check Đối chiếu:** Áp dụng khi đã có sẵn file Excel OCR thô (do Flash-Lite hoặc công cụ OCR cấp 1 tạo ra). Hệ thống tiến hành soi ảnh scan gốc để kiểm định dải số tờ, sửa lỗi chính tả OCR, lọc bỏ bìa loại trừ, và chuẩn hóa dãy số tờ liên tục.
  - **Chế độ 2 - Direct AI Vision:** Áp dụng khi **chưa có file OCR thô** (chỉ có thư mục ảnh scan gốc `.jpg` và `_capture.json`). Hệ thống dùng AI Vision đọc trực tiếp ảnh scan gốc, tự động phân nhóm văn bản nhiều tờ, trích xuất chuẩn 8 trường thông tin và xuất thẳng file Excel hoàn chỉnh không cần khâu OCR sơ bộ trung gian.

---

## 2. CẤU TRÚC DỮ LIỆU ĐẦU RA CHUẨN (EXCEL-COMPATIBLE JSON SCHEMA)

> [!IMPORTANT]
> **QUY TẮC ĐỊNH DẠNG JSON KHI XUẤT FILE:**
> Khi người dùng yêu cầu trích xuất dữ liệu của hồ sơ hoặc xuất file JSON để xuất Excel, **BẮT BUỘC** phải trả về đúng cấu trúc **Dossier Root Object** dưới đây. Không trả về mảng trần `[{...}]` hay thiếu thông tin hồ sơ, để bộ máy `lib/excel-export-vp.js` có thể xuất ra file Excel hoàn chỉnh có đầy đủ tiêu đề, năm và số ký hiệu hồ sơ.

```json
{
  "donViCapTren": "Ủy ban nhân dân huyện Định Quán",
  "donVi": "Ủy ban nhân dân xã Phú Lợi",
  "soKyHieuHoSo": "01",
  "tenHoSo": "Hồ sơ về việc thu, chi ngân sách và quản lý tài chính công của Ủy ban nhân dân xã Phú Lợi năm 2024",
  "tieuDeNghiQuyet": "Hồ sơ về việc thu, chi ngân sách và quản lý tài chính công của Ủy ban nhân dân xã Phú Lợi năm 2024",
  "namGiaiDoan": "2024",
  "thoiGianHoSo": "Từ ngày 05/01/2024 đến ngày 31/12/2024",
  "tongSoToText": "Bản mục lục này gồm 05 văn bản, 15 tờ",
  "thbq": "Vĩnh viễn",
  "banTo": "Văn phòng",
  "tapSo": "01",
  "rows": [
    {
      "soTT": "1",
      "soKyHieuVanBan": "02/KH-UBND",
      "ngayThangVanBan": "05/01/2024",
      "tenLoaiTrichYeu": "Kế hoạch về việc thu ngân sách nhà nước trên địa bàn xã Phú Lợi năm 2024",
      "tacGiaVanBan": "UBND xã Phú Lợi\nBan Tài chính",
      "toSoTrangSo": "01-03",
      "loaiBan": "Bản gốc",
      "ghiChu": ""
    }
  ],
  "rowsTrung": []
}
```

---

## 3. BỘ QUY TẮC BÓC TÁCH & ĐỐI CHIẾU CHI TIẾT (9 NGUYÊN TẮC VÀNG)

### 📌 Nguyên tắc 1: Xử lý Tấm ảnh đầu tiên (Bìa hồ sơ) & Tấm ảnh cuối cùng (Tờ chốt ghim bấm)
* **Tấm ảnh đầu tiên (`001.jpg`):**
  - Luôn là **Bìa ngoài của tập/hộp hồ sơ** (chữ viết tay ghi tên xã, trích yếu chung, năm).
  - **Xử lý:** BẮT BUỘC bỏ qua khỏi bảng mục lục văn bản (`status: "skip"`, `isExcluded: true`). Chỉ dùng nội dung trên bìa để trích xuất `tenHoSo`, `namGiaiDoan`, `donVi`.
* **Tấm ảnh cuối cùng của hồ sơ:** Phân biệt rõ 2 trường hợp:
  - **Trường hợp A - Ảnh cuối là "Tờ chốt cuối" của tài liệu kế cuối (Tài liệu nhiều tờ):**
    - *Dấu hiệu 1 (Dấu bấm ghim):* Soi góc trên bên trái của ảnh tài liệu kế cuối. Nếu có **vết bấm ghim (kim bấm)** $\rightarrow$ tài liệu đó là tập văn bản nhiều tờ được ghim bấm. Người số hóa chỉ chụp trang đầu (trang tiêu đề) và trang cuối cùng (trang chốt số tờ).
    - *Dấu hiệu 2 (Nội dung phụ lục / Bảng biểu đính kèm):* Nếu các ảnh trước đều là văn bản hành chính thông thường (Quyết định, Báo cáo, Kế hoạch...), tự nhiên ảnh cuối cùng lại là một bảng biểu, biểu mẫu tổng hợp (chụp bảng ngang, mẫu số 02, hoặc có ghi chú kèm theo văn bản trước) $\rightarrow$ đây là tờ phụ lục cuối được ghim đính kèm cùng văn bản trước đó.
    - *Cách xử lý:*
      1. Đánh dấu tấm ảnh cuối là **BỎ QUA** (`status: "skip"`, `isExcluded: true`).
      2. **Lấy số tờ của tấm cuối gán làm số tờ kết thúc cho tài liệu kế cuối.**
      3. *Ví dụ:* Tấm `009.jpg` là Báo cáo `162/BC-UBND` có số tờ `27` và có vết bấm ghim góc trên trái; tấm cuối `010.jpg` là bảng biểu có số tờ `36` $\rightarrow$ Bỏ qua tấm `010.jpg`, cập nhật dải số tờ cho Báo cáo `162/BC-UBND` thành **`27-36`**.
  - **Trường hợp B - Ảnh cuối đích thị là một văn bản độc lập:**
    - Có đầy đủ quốc hiệu, tiêu đề văn bản riêng biệt, không có dấu bấm ghim gộp chung với văn bản trước, số tờ tiếp nối độc lập $\rightarrow$ Xử lý như một dòng văn bản bình thường.

---

### 📌 Nguyên tắc 2: Nhận diện & Xử lý Tài liệu Loại ("Trùng" hoặc "Photo" ghi trên trang)
* **Dấu hiệu nhận biết:**
  - Khi đọc ảnh scan, ở vị trí **số trang viết tay** hoặc ở **phía trên trang giấy** (lề trên, mép trên):
    - Có ghi chữ viết tay hoặc đóng dấu: **`"trùng"`** (hoặc `"trùng..."`, `"trùng lặp"`).
    - Hoặc có ghi chữ: **`"photo"`** (hoặc bản photocopy).
* **Cách xử lý trong Hồ sơ hiện tại:**
  - BẮT BUỘC **BỎ QUA** trang ảnh đó khỏi hồ sơ hiện tại.
  - Đánh dấu trong file `.job.json`: `status: "skip"`, `isExcluded: true`.
  - **KHÔNG đưa nội dung văn bản này vào file biên mục / file Excel của hồ sơ đó.**
* **Cách xử lý đồng bộ vào File Tài liệu loại dùng chung:**
  - File tài liệu loại lưu tại:
    `C:\Users\Toan\Downloads\BienMuc_Phu_Loc_ch_check\Da_check\Tl_loại_VP_Toàn_PL.xlsx`
  - Bổ sung nối tiếp vào cuối danh sách:
    - **Nếu là văn bản PHOTO:**
      - Thêm vào Sheet **`Photo`**.
      - Cột 3 (*Tiêu đề hồ sơ/tài liệu loại*): Ghi tên loại và trích yếu văn bản (không cần quan tâm trùng hồ sơ nào).
      - Bó số = 1, Tập số = 1, THBQ = `"Vĩnh viễn"`, Lý do huỷ = `"Không có giá trị"`, Ghi chú = `"Photo"`.
    - **Nếu là văn bản TRÙNG:**
      - Thêm vào Sheet **`Trùng`**.
      - Cột 3 (*Tiêu đề hồ sơ/tài liệu loại*): Ghi tên loại và trích yếu văn bản trùng.
      - Cột 5 (*Lý do huỷ*): BẮT BUỘC ghi rõ theo mẫu: **`Trùng hs [Mã_hồ_sơ]`** (ví dụ: `Trùng hs PL_2023_23F`).
      - Bó số = 1, Tập số = 1, THBQ = `"Vĩnh viễn"`.

---

### 📌 Nguyên tắc 3: Tác giả văn bản (`tacGiaVanBan`)
* **Vị trí lấy:** Khối Letterhead in hoa ở góc trên bên trái, **nằm TRƯỚC dòng `Số:...`**.
* **Luật đa cấp (2–3 dòng xếp chồng):**
  * BẮT BUỘC ghép đầy đủ cơ quan cấp trên và đơn vị tham mưu/ban chỉ đạo trực tiếp, nối nhau bằng dấu gạch ngang `" - "` hoặc xuống dòng `\n`.
  * *Ví dụ:* 
    * `UBND XÃ PHÚ LỘC` + `TỔ LẤY Ý KIẾN CẤP XÃ` $\rightarrow$ `UBND xã Phú Lộc - Tổ lấy ý kiến cấp xã`.
    * `UBND HUYỆN ĐỊNH QUÁN` + `PHÒNG NỘI VỤ` $\rightarrow$ `UBND huyện Định Quán - Phòng Nội vụ`.
* **Tuyệt đối KHÔNG lấy:**
  * KHÔNG lấy chữ từ con dấu đỏ *"ĐẾN"*.
  * KHÔNG lấy từ dòng chức danh người ký giữa trang (*"GIÁM ĐỐC...", "CHỦ TỊCH..."*).
  * KHÔNG lấy phần *"Nơi nhận:"* ở góc dưới cùng.

---

### 📌 Nguyên tắc 4: Số ký hiệu văn bản (`soKyHieuVanBan`)
* **Vị trí lấy:** Sau chữ `"Số:"` hoặc `"Số ..."` ở góc trái phía trên.
* **Chuẩn hóa:**
  * Bỏ tiền tố `"Số:"`, bỏ các ký tự rác.
  * Thu gọn khoảng trắng quanh dấu gạch chéo `/` và gạch ngang: `256 - BC / HU` $\rightarrow$ `256-BC/HU`.
  * Nếu văn bản không có số (ví dụ Giấy mời, Bản dự thảo đóng dấu `DỰ THẢO` đè lên chữ `/TB-UBND`) $\rightarrow$ để trống `""`.

---

### 📌 Nguyên tắc 5: Ngày tháng văn bản (`ngayThangVanBan`)
* **Vị trí hợp lệ:** **CHỈ lấy ngày ở phần đầu văn bản** (dưới quốc hiệu góc phải hoặc cạnh dòng Số).
* **Luật cấm (Lỗi OCR hay mắc phải nhất):**
  * **CẤM** lấy ngày trong câu mở đầu *"Hôm nay, ngày..."* (như trong các Biên bản họp, Biên bản kiểm phiếu).
  * **CẤM** lấy ngày ban hành của các văn bản pháp lý viện dẫn trong phần *"Căn cứ Luật/Nghị định số... ngày... tháng... năm..."*.
  * **CẤM** lấy ngày ký của lãnh đạo ở cuối trang.
  * Nếu phần đầu trang không có ngày tháng $\rightarrow$ Bắt buộc để rỗng `""`.
* **Định dạng bắt buộc:** Chuẩn `dd/mm/yyyy` (ví dụ: `10/10/2022`).

---

### 📌 Nguyên tắc 6: Tên loại & Trích yếu (`tenLoaiTrichYeu`)
* **Chuẩn hóa tiền tố:**
  * Tự động chuyển `"V/v:"`, `"V/v"`, `"Về việc"` thành `"về việc"` (viết thường).
  * *Đúng:* `Quyết định về việc thành lập Hội đồng nghĩa vụ quân sự`.
* **Bảo toàn nguyên trạng:**
  * Nếu văn bản **không có chữ "về việc"** $\rightarrow$ Giữ nguyên tên loại + nội dung, **tuyệt đối không tự ý chèn thêm chữ "về việc"**.
  * **Không tự ý thêm chữ "Công văn"** nếu bản gốc chỉ ghi trích yếu.
* **LUẬT BỔ SUNG TÊN NGƯỜI (BẮT BUỘC):**
  * Quét nhanh phần thân văn bản bên dưới tiêu đề (*"Xét đề nghị...", "Căn cứ...", "Điều 1...", "Kính mời..."*) để tìm tên cá nhân được bổ nhiệm, khen thưởng, kỷ luật, công nhận, xử phạt hoặc kính mời.
  * Nhận diện: `đ/c`, `đồng chí`, `ông`, `bà`, `anh`, `chị` + HỌ VÀ TÊN.
  * Ghép vào cuối trích yếu sau dấu phẩy:
    * *Ví dụ:* `Quyết định về việc thành lập tổ lấy ý kiến nhân dân đối với các chức danh công chức xã Phú Lộc năm 2022, ông Liêu Thế Vũ`.
    * *Ví dụ:* `Giấy mời dự Hội nghị lấy ý kiến nhân dân đối với các chức danh công chức xã Phú Lộc năm 2022, đ/c Nguyễn Văn Cường`.

---

### 📌 Nguyên tắc 7: Tờ số / Số trang viết tay (`toSoTrangSo`)
* **Vị trí lấy:** **CHỈ lấy số viết tay (bút chì, bút bi) ở mép lề trên trang** (thường ở góc trên bên phải hoặc chính giữa mép trên).
* **Định dạng hợp lệ:** Số đơn (`01`, `09`), khoảng tờ (`01-08`, `27-36`).
* **Cơ chế tự động nhảy dải số tờ (Auto Page Ranges):**
  - Khi nhập số đơn liên tục (`01`, `09`, `20`), bộ máy xuất Excel tự động mở rộng thành dải tờ chuẩn (`01-08`, `09-19`).
  - Nếu văn bản đã ghi rõ dải tờ (như `27-36`), hệ thống giữ nguyên tuyệt đối.
* **Tuyệt đối KHÔNG lấy:** Số ghi chú độ dày, số điều khoản, số ngày tháng in trên trang.

---

### 📌 Nguyên tắc 8: Loại bản (`loaiBan`)
* **Mặc định:** Gán là **`"Bản gốc"`** cho mọi ảnh chụp từ hồ sơ lưu trữ thực tế.
* **Chỉ gán `"Bản chính"`:** Khi trên trang in rõ ràng dập chữ `"BẢN CHÍNH"`.
* **Phân loại khác:** `"Bản gốc không mộc"` (biên bản có chữ ký sống nhưng không có con dấu), `"Photo"` (bản photocopy đen trắng).

---

### 📌 Nguyên tắc 9: Cột Ghi chú (`ghiChu`) — Tối giản, không thêm nội dung rườm rà
* **KHÔNG tự ý điền các ghi chú giải thích/diễn giải nội bộ** (như "Bản dự thảo có dấu", "Bản mẫu chưa điền", "Trùng văn bản...").
* **Mặc định để trống `""`** cho cột `ghiChu`.
* **CHỈ ghi nhận độ mật:** Khi trên văn bản dập con dấu độ mật (`"Tuyệt mật"` hoặc `"Mật"`).

---

## 4. QUY TRÌNH THỰC HIỆN DOUBLE-CHECK CHO NGƯỜI DÙNG

Mỗi khi người dùng gửi ảnh hoặc yêu cầu soát lỗi một tài liệu/hồ sơ VP:
1. **Đối chiếu thực tế:** Soi trực tiếp từng pixel trên ảnh đối chiếu với bản OCR cũ (nếu có).
2. **Kiểm tra ảnh đầu tiên (`001.jpg`):** Đánh dấu bìa hồ sơ bỏ qua (`status: "skip"`, `isExcluded: true`).
3. **Kiểm tra chữ "Trùng" hoặc "Photo":** Nếu ở số trang hoặc mép trên có chữ Trùng/Photo $\rightarrow$ Bỏ qua khỏi hồ sơ (`status: "skip"`), đồng bộ ngay vào file `Tl_loại_VP_Toàn_PL.xlsx`.
4. **Kiểm tra ảnh kế cuối & ảnh cuối:** Soi góc trên bên trái xem có vết bấm ghim hay bảng phụ lục không $\rightarrow$ nếu có, bỏ qua ảnh cuối và gộp số tờ cho ảnh kế cuối.
5. **Áp dụng 9 nguyên tắc vàng** để chuẩn hóa các trường thông tin.
6. **Cột `ghiChu`:** Giữ trống `""` trừ khi có dấu mật.
7. **Xuất bảng so sánh:** Trình bày rõ Trước vs Sau các điểm đã sửa.
8. **Cập nhật JSON & Xuất Excel:** Xuất trực tiếp ra file Excel chuẩn format `bienmuc`.

---

## 5. CƠ CHẾ XUẤT EXCEL TỰ ĐỘNG KHỐI VĂN PHÒNG (VP / UBND)

Hệ thống đã tích hợp sẵn module xuất Excel tương thích chuẩn `bienmuc` tại thư mục dự án:
- Thư viện cốt lõi: [`lib/excel-export-vp.js`](file:///d:/BG/Check_HS_BM/lib/excel-export-vp.js)
- Thư viện đồng bộ tài liệu loại: [`lib/tai-lieu-loai-sync.js`](file:///d:/BG/Check_HS_BM/lib/tai-lieu-loai-sync.js)
- Công cụ CLI: [`scripts/export_excel_vp.js`](file:///d:/BG/Check_HS_BM/scripts/export_excel_vp.js)

### Cách chạy lệnh xuất Excel:
```bash
# Xuất trực tiếp từ file JSON:
npm run export:excel -- <duong_dan_file.json> [duong_dan_file_xuat.xlsx]
```

---

## 6. QUY TRÌNH XỬ LÝ THEO LÔ / HÀNG LOẠT (BATCH PROCESSING 3 – 5 HỒ SƠ)

Nhằm tối ưu hóa tốc độ khi xử lý khối lượng lớn hàng trăm hồ sơ mà vẫn giữ trọn vẹn **độ chuẩn xác 100%**, hệ thống áp dụng cơ chế xử lý theo Lô (Batch):

* **Kích thước Lô chuẩn:** **3 đến 5 hồ sơ / lượt** (tương đương 100 – 250 ảnh scan). Đây là ngưỡng tối ưu giúp AI tập trung thị giác tối đa, không bị bão hòa ngữ cảnh hay bỏ sót vết ghim mờ / chữ viết tay nhỏ.
* **Quy trình Batch 3 bước:**
  1. **Bước 1 - Cắt ghép ma trận thị giác đa luồng (Sharp Engine):**
     - Tự động quét toàn bộ ảnh của các hồ sơ trong lô.
     - Cắt ma trận ảnh Top-Right (số tờ, mép trên tìm chữ "trùng"/"photo") và Top-Left / Header (quốc hiệu, tiêu đề, vết bấm ghim kim kẹp).
     - Tự động nhận diện ảnh bìa ngoài `001.jpg` để trích xuất tiêu đề hồ sơ và loại trừ khỏi bảng mục lục (`status: "skip"`, `isExcluded: true`).
  2. **Bước 2 - AI rà soát thị giác 100% ảnh scan (Visual Double-Check Matrix):**
     - Soi toàn bộ ma trận ảnh: bắt dấu bấm ghim ở ảnh kế cuối & phụ lục tờ cuối theo **Nguyên tắc 1**.
     - Soi mép trên tìm chữ viết tay `"trùng"` hoặc `"photo"` theo **Nguyên tắc 2**.
     - Chuẩn hóa trích yếu, bổ sung tên cá nhân (`ông`, `bà`, `đ/c`...) theo **Nguyên tắc 6**.
     - Đảm bảo dải số tờ liên tục từ tờ đầu tiên (`01`) đến tờ cuối cùng, không đứt đoạn, không chồng lấn.
     - Cột `ghiChu` luôn để rỗng `""`.
  3. **Bước 3 - Xuất Excel đồng loạt & Đồng bộ tài liệu loại an toàn:**
     - Tự động sao lưu file gốc `.job.json.bak`.
     - Cập nhật dữ liệu sạch vào file `.job.json`.
     - Xuất đồng thời các file Excel tương ứng vào cả 2 thư mục:
       - Thư mục kiểm tra: `C:\Users\Toan\Downloads\BienMuc_Phu_Loc_ch_check\Da_check\<Mã_HS>.xlsx`
       - Thư mục OCR: `C:\Users\Toan\Pictures\anh_HS_ch_check\PL_outputOCR\<Mã_HS>.xlsx`
     - Gom an toàn các tài liệu Trùng / Photo phát hiện được (nếu có) và đồng bộ nối tiếp vào file tổng hợp `Tl_loại_VP_Toàn_PL.xlsx`.
     - Báo cáo bảng tổng kết nghiệm thu chi tiết của toàn bộ lô hồ sơ cho người dùng.



---

## 7. KINH NGHIỆM THỰC CHIẾN & CÁC TÌNH HUỐNG NGOẠI LỆ (EDGE CASES TỪ 2015 – 2021)

Qua quá trình rà soát hàng trăm hồ sơ và hàng vạn trang scan thực tế (giai đoạn 2015 – 2021), hệ thống đã đúc kết các quy tắc xử lý ngoại lệ đặc thù:

### 7.1. Giấy Note dán mép / ghi chú chữ viết tay trên trang bìa hoặc văn bản
* **Hiện tượng:** Nhân viên lưu trữ dán giấy note vàng/hồng hoặc ghi bút bi lên góc bìa `001.jpg` hoặc đầu tài liệu: *"Trùng cả tập", "Bỏ bản này lấy bản sau", "Scan lại do mờ"*.
* **Xử lý:**
  - Tuyệt đối không đưa nội dung giấy note vào trích yếu.
  - So sánh trực tiếp văn bản ghi note với văn bản liền kề. Nếu xác nhận là bản scan thử/trùng/hỏng: tách ra danh sách `Trùng` hoặc `Photo`, gán `status: "skip"`, `isExcluded: true`, không tính vào dải số tờ chính thức.
  - Đồng bộ ngay thông tin vào sổ theo dõi tài liệu loại.

### 7.2. Văn bản scan lại (Rescan) & Kẹp bấm ghim kép
* **Hiện tượng:** Cùng 1 văn bản được chụp 2 lần (ví dụ trang 1 chụp tối, trang 2 chụp sáng hơn; hoặc scan sót trang sau đó thợ scan chụp bù chèn giữa hồ sơ).
* **Xử lý:**
  - Nhận diện vết bấm ghim kim kẹp ở góc trên bên trái: Văn bản nào bấm ghim hoàn chỉnh từ tờ đầu đến tờ cuối thì giữ lại làm bản chính.
  - Bản scan lỗi/scan thừa được đánh dấu là `Trùng` và loại ra.
  - Nếu thợ scan đánh số tờ bút chì đè lên nhau (ví dụ cả 2 tờ cùng ghi số `12`), chỉ tính 1 tờ vào chuỗi số liên tục `01 -> N`, bản còn lại chuyển sang danh mục loại.

### 7.3. Văn bản dự thảo / không số hiệu / không ngày tháng (Draft Copy)
* **Hiện tượng:** Tờ trình, biên bản, kế hoạch, thông báo dạng dự thảo lấy ý kiến, chưa được vào sổ văn thư nên chưa có số hiệu hoặc để trống ngày tháng `.../..../201x`.
* **Xử lý:**
  - Cột `soHieu`: Ghi rỗng `""` hoặc ghi trích yếu phản ánh đúng tính chất (`Dự thảo Tờ trình...`).
  - Cột `ngayThang`: Nếu trên văn bản có ghi tháng/năm ở cuối trang thì lấy ngày cuối tháng hoặc để trống ngày (`/tháng/năm`); nếu hoàn toàn không có ngày thì để rỗng `""`.
  - Cột `tacGia`: Lấy đơn vị soạn thảo (phòng, ban, tổ công tác) thể hiện ở phần đầu hoặc người ký ở chân chữ ký.

### 7.4. Lỗi đánh số tờ của nhân viên nhập liệu (Excel Typist Errors)
* **Hiện tượng:**
  - *Nhảy cóc số tờ (Gaps):* Văn bản A kết thúc ở tờ `08`, nhưng văn bản B trong Excel nhập liệu ban đầu lại bắt đầu từ tờ `10` (thiếu tờ `09`).
  - *Chồng lấn số tờ (Overlaps):* Văn bản A ghi `01-05`, văn bản B ghi `05-08` (tờ `05` bị tính 2 lần).
  - *Nhầm lẫn giữa Số trang in và Số tờ lưu trữ:* Văn bản 4 trang in 2 mặt (chỉ có 2 tờ giấy) nhưng nhân viên nhập là `01-04` thay vì `01-02`.
* **Xử lý:**
  - **Quy tắc Vàng:** Chuỗi số tờ mục lục BẮT BUỘC phải đếm theo số tờ vật lý scan thực tế (bút chì góc trên bên phải) và liên tục 100% từ `01` đến `N`.
  - Tự động hiệu chỉnh lại `toSo` và `soTo` của văn bản bị lệch dựa trên số lượng ảnh scan thực tế của văn bản đó.

### 7.5. Phụ lục (Annexes) và Tờ chốt ghim cuối cùng
* **Hiện tượng:** Văn bản chính (như Báo cáo, Quyết định giao chỉ tiêu) kèm theo 1 hoặc nhiều trang bảng biểu phụ lục ở phía sau.
* **Xử lý:**
  - Không tách phụ lục thành văn bản độc lập nếu phụ lục đó thuộc về văn bản chính (tiêu đề ghi "Phụ lục kèm theo Quyết định số...").
  - Gộp toàn bộ số tờ của văn bản chính và các trang phụ lục thành một dải số tờ duy nhất (ví dụ: Quyết định tờ 01, Phụ lục tờ 02-05 $\rightarrow$ ghi tờ số `01-05`).

### 7.6. Khối Văn hóa - Xã hội (Chuyên đề Nông thôn mới nâng cao): Xử lý Bìa 2 lớp
* **Hiện tượng:** Trong hồ sơ NTM của khối VHXH, nhân viên scan thường chụp 2 lớp bìa:
  - Lớp 1 (`001.jpg`): Bìa lưu trữ form in sẵn (có chữ to "HỒ SƠ", kẻ viền đôi, ghi tên xã Trà Cổ).
  - Lớp 2 (`002.jpg`): Bìa tập chuyên đề màu xanh (in hoa "HỒ SƠ NÔNG THÔN MỚI NÂNG CAO" hoặc "HỒ SƠ MINH CHỨNG TIÊU CHÍ...").
* **Xử lý:**
  - Cả 2 ảnh bìa này đều **KHÔNG** phải văn bản hành chính bên trong hồ sơ.
  - Tự động bóc tách cả 2 ảnh sang sheet phụ `Tài liệu loại` (hoặc file loại chung `Tl_loại_VP_Toàn_TC.xlsx`).
  - Văn bản mục lục chính bắt đầu đánh số từ văn bản thực sự đầu tiên (`003.jpg`), với số tờ xuất phát chuẩn xác từ `01` (hoặc `01-xx`).

### 7.7. Tập hình ảnh minh chứng Nông thôn mới (Photo Evidence Album)
* **Hiện tượng:** Ở cuối mỗi hồ sơ tiêu chí NTM thường có 5 đến 30 tờ in màu chụp các công trình: trường học, đường hoa, trạm y tế, cổng chào, bãi xử lý rác, mô hình chăn nuôi...
* **Xử lý:**
  - **Quy tắc gộp:** BẮT BUỘC gộp toàn bộ các trang ảnh liên tiếp này thành **một mục văn bản duy nhất** trong mục lục:
    - *Tên loại và trích yếu:* `"Hình ảnh minh chứng kết quả xây dựng nông thôn mới nâng cao xã Trà Cổ năm 2022 ([Tên công trình/tiêu chí])"`
    - *Tác giả:* `"Ủy ban nhân dân xã Trà Cổ"`
    - *Ngày tháng:* Ghi năm `"2022"` (hoặc ngày chụp nếu có in trên ảnh)
    - *Số tờ:* Dải liên tục từ trang ảnh đầu đến trang ảnh cuối (ví dụ `09-15`).
  - **CẤM:** Tuyệt đối không bóc tách mỗi bức ảnh thành một dòng STT riêng lẻ.

### 7.8. Bảng biểu tự chấm điểm tiêu chí NTM không số hiệu
* **Hiện tượng:** Các bảng tự đánh giá chấm điểm 19 tiêu chí NTM thường chỉ có tiêu đề bảng và ghi dòng chữ nhỏ: *"Đính kèm Báo cáo số 88/BC-UBND ngày 15/9/2022 của UBND xã Trà Cổ"*.
* **Xử lý:**
  - Cột `soKyHieu`: Để trống `""`.
  - Cột `ngayThang`: Lấy theo ngày của Báo cáo đính kèm (ví dụ: `15/09/2022`).
  - Cột `tenLoaiTrichYeu`: Ghi rõ tên bảng biểu + xuất xứ: `"Kết quả thực hiện tiêu chí nông thôn mới nâng cao năm 2022 xã Trà Cổ (kèm theo Báo cáo số 88/BC-UBND ngày 15/9/2022 của UBND xã Trà Cổ)"`.
* **Hiện tượng:** Phụ lục bảng biểu nhiều trang không đánh số hiệu riêng, hoặc có số trang in riêng (`Trang 1/5`, `Trang 2/5`...).
* **Xử lý:**
  - Phụ lục đính kèm theo văn bản chính được gộp chung số tờ với văn bản chính đó nếu chúng được bấm chung 1 ghim.
  - Chỉ tách thành văn bản riêng trong mục lục nếu có tiêu đề độc lập rõ ràng và có quyết định/thông báo phê duyệt riêng.

---

## 8. TÍCH HỢP CLI & CẤU HÌNH ĐỘC LẬP (STANDALONE WORKFLOW)

Hệ thống được thiết kế dạng module hoàn chỉnh, cho phép người dùng chạy kiểm tra tự động mà không phụ thuộc vào đường dẫn máy tính cố định:

### 8.1. Cấu trúc cấu hình môi trường (.env)
Sao chép `.env.example` thành `.env` và điều chỉnh các đường dẫn phù hợp với máy trạm:
```env
PHOTO_DIR=C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos
OUTPUT_OCR_DIR=C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR
DA_CHECK_DIR=C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check
RAW_EXCEL_DIR=C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check
TAI_LIEU_LOAI_FILE=C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/Tl_loại_VP_Toàn_PL.xlsx
```

### 8.2. Các lệnh CLI hỗ trợ:
```bash
# 1. Kiểm tra tính liên tục và khớp nối dải tờ của 1 hồ sơ:
node bin/bienmuc-cli.js verify <Ma_HS>
# Ví dụ:
node bin/bienmuc-cli.js verify PL_2015_15D

# 2. Kiểm tra toàn bộ hồ sơ của một năm:
node bin/bienmuc-cli.js verify-year <Nam>
# Ví dụ:
node bin/bienmuc-cli.js verify-year 2015

# 3. Cắt ma trận góc trên bên phải (Top-Right) để rà soát thị giác:
node bin/bienmuc-cli.js grid <Ma_HS>

# 4. Xuất file Excel chuẩn khối Văn phòng:
npm run export:excel -- <file_job.json> [file_xuat.xlsx]
```
