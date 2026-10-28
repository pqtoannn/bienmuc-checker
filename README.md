# 🏛️ Hệ Thống Biên Mục & Soát Lỗi Hồ Sơ Lưu Trữ (VP / UBND)
### *AI-Powered Visual Archival Verification, Continuous Sheet Auditing & Excel Cataloging*

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Engine](https://img.shields.io/badge/Vision_Engine-Sharp-orange.svg)](https://sharp.pixelplumbing.com/)
[![Excel](https://img.shields.io/badge/Format-ExcelJS%20%7C%20XLSX-green.svg)](https://github.com/exceljs/exceljs)

Hệ thống chuyên dụng phục vụ công tác rà soát, kiểm định thị giác (visual double-check), chuẩn hóa thể thức và xuất mục lục hồ sơ tài liệu lưu trữ khối Văn phòng HĐND & UBND (cấp tỉnh, huyện, thị xã). Tích hợp engine xử lý ảnh hiệu năng cao đa luồng (**Sharp**) cùng bộ quy chuẩn nghiệp vụ lưu trữ Việt Nam (**Agent Skill: `bienmuc-checker`**).

---

## 🌟 Tính Năng Nổi Bật

1. **Rà soát thị giác dải số tờ (Visual Corner Grid):**
   - Tự động cắt ma trận góc trên bên phải (Top-Right) ảnh scan để soi số bút chì và nhận diện chữ viết tay *"trùng"*, *"photo"*.
   - Nhận diện vết bấm ghim kim kẹp góc trên bên trái (Top-Left) để xác định chính xác tờ chốt cuối của văn bản và phụ lục đi kèm.
   - Bóc tách trang bìa ngoài (`001.jpg`) thành tiêu đề hồ sơ và loại trừ an toàn khỏi danh mục văn bản con.
2. **Kiểm định tính liên tục của dải số tờ (Gapless & Zero Overlap Verification):**
   - Đảm bảo 100% hồ sơ có dải số tờ liên tục từ tờ đầu tiên (`01`) đến tờ cuối cùng (`N`), tuyệt đối không có khoảng trống (gaps) hoặc trùng lặp số tờ (overlaps).
   - Kiểm tra tính nhất quán giữa số lượng ảnh scan vật lý và số tờ kê khai trong mục lục.
3. **Đồng bộ tự động tài liệu loại (Tài liệu Trùng / Photo):**
   - Tự động phát hiện và trích xuất tài liệu loại khỏi mục lục chính thức.
   - Tự động khởi tạo và đồng bộ nối tiếp dữ liệu sạch vào file `Tl_loại_VP_Toàn_PL.xlsx` phân loại theo 2 sheet chuẩn: `Trùng` và `Photo`.
4. **Xuất Excel chuẩn thể thức lưu trữ Việt Nam khối Văn Phòng:**
   - Tạo file mục lục văn bản `.xlsx` chuẩn form nghiệp vụ: `STT`, `Hộp số`, `Hồ sơ số`, `Số, ký hiệu`, `Ngày tháng`, `Tác giả`, `Trích yếu`, `Tờ số`, `Số tờ`, `Loại bản`, `Ghi chú`.
   - Cột `ghiChu` luôn để rỗng `""` theo đúng quy định lưu trữ hành chính.
5. **Chuẩn hóa Agent Skill (`.agents/skills/bienmuc-checker`):**
   - Sẵn sàng tích hợp cho các AI coding agent (Antigravity, Claude Code, Gemini CLI, Cursor, v.v.) để tự động hóa xử lý theo lô 3 – 5 hồ sơ / lượt.

---

## 🚀 Hướng Dẫn Cài Đặt Nhanh (3 Bước)

### Bước 1: Clone kho mã nguồn
```bash
git clone https://github.com/your-username/Check_HS_BM.git
cd Check_HS_BM
```

### Bước 2: Cài đặt các thư viện phụ thuộc
Hệ thống sử dụng các thư viện độc lập nằm ngay trong `package.json`:
```bash
npm install
```

### Bước 3: Cấu hình môi trường (`.env`)
Sao chép file mẫu `.env.example` thành `.env` và điều chỉnh các đường dẫn thư mục tương ứng trên máy tính của bạn:
```bash
cp .env.example .env
```

Nội dung `.env`:
```env
# Thư mục chứa ảnh scan gốc theo từng mã hồ sơ (ví dụ: PL_2015_15A/001.jpg)
PHOTO_DIR=C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos

# Thư mục lưu file OCR / Job JSON và file Excel kết quả
OUTPUT_OCR_DIR=C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR

# Thư mục chứa kết quả Excel đã kiểm tra nghiệm thu
DA_CHECK_DIR=C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check

# Thư mục chứa các file Excel gốc ban đầu (nếu có)
RAW_EXCEL_DIR=C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check

# Đường dẫn file Excel tổng hợp tài liệu loại (Trùng / Photo)
TAI_LIEU_LOAI_FILE=C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/Tl_loại_VP_Toàn_PL.xlsx
```

---

## 🛠️ Hướng Dẫn Sử Dụng CLI Runner

Bộ công cụ CLI đa năng được tích hợp sẵn tại `bin/bienmuc-cli.js`:

### 1. Kiểm tra tính liên tục của một hồ sơ
```bash
node bin/bienmuc-cli.js verify <Ma_HS>

# Ví dụ kiểm tra hồ sơ PL_2015_15D:
node bin/bienmuc-cli.js verify PL_2015_15D
```
*Kết quả mẫu:*
```text
=== KIỂM TRA HỒ SƠ: PL_2015_15D ===
- Tên hồ sơ: ...
- Số văn bản: 141
- Dải số tờ: 01 -> 296
- Số tờ dự kiến (theo ảnh scan vật lý): 296
- Tổng số tờ kê khai: 296
=> KẾT QUẢ: PASS (Dải số tờ liên tục 100%, không bị đứt đoạn hay chồng lấn)
```

### 2. Kiểm tra toàn bộ hồ sơ của một năm
```bash
node bin/bienmuc-cli.js verify-year <Nam>

# Ví dụ kiểm tra toàn bộ hồ sơ năm 2015:
node bin/bienmuc-cli.js verify-year 2015
```
*Kết quả mẫu:*
```text
=== BÁO CÁO TỔNG HỢP KIỂM ĐỊNH NĂM 2015 ===
Tổng số hồ sơ kiểm tra: 13
- Hợp lệ (PASS): 13
- Lỗi (FAIL):    0
Tổng số văn bản đã kiểm tra: 1,012
Tổng số trang scan vật lý:   2,203
```

### 3. Cắt ma trận góc trên bên phải (Top-Right Grid) để soi thị giác
```bash
node bin/bienmuc-cli.js grid <Ma_HS> [--cols 4] [--width 500]

# Ví dụ cắt ma trận cho hồ sơ PL_2015_15M:
node bin/bienmuc-cli.js grid PL_2015_15M
```
File ma trận ảnh ghép sẽ được lưu tự động tại thư mục tạm để người dùng hoặc AI Agent dễ dàng mở lên kiểm tra toàn bộ dải số tờ và chữ viết tay chỉ trong 1 khung nhìn duy nhất.

### 4. Khởi tạo / Đồng bộ sổ theo dõi tài liệu loại
```bash
node bin/bienmuc-cli.js sync-loai
```
Lệnh này kiểm tra sự tồn tại của file `Tl_loại_VP_Toàn_PL.xlsx`. Nếu chưa có, hệ thống tự động khởi tạo file mẫu với 2 sheet chuẩn `Trùng` và `Photo` kèm đầy đủ tiêu đề cột định dạng chuyên nghiệp.

### 5. Xuất file Excel chuẩn khối Văn Phòng từ file JSON
```bash
npm run export:excel -- <duong_dan_file.job.json> [duong_dan_file_xuat.xlsx]
```

---

## 📂 Cấu Trúc Dự Án

```text
Check_HS_BM/
├── .agents/
│   └── skills/
│       └── bienmuc-checker/
│           └── SKILL.md             # Bộ nguyên tắc nghiệp vụ & quy trình rà soát cho AI Agent
├── bin/
│   └── bienmuc-cli.js               # CLI runner hợp nhất cho toàn bộ hệ thống
├── config/
│   ├── default.json                 # Cấu hình tham số mặc định
│   └── index.js                     # Loader cấu hình linh hoạt (đọc từ .env & fallback)
├── lib/
│   ├── excel-export-vp.js           # Module xuất Excel chuẩn thể thức lưu trữ khối VP
│   ├── tai-lieu-loai-sync.js        # Module đồng bộ dữ liệu tài liệu Trùng / Photo
│   └── visual-inspector.js          # Engine cắt ma trận và kiểm định thị giác bằng Sharp
├── scripts/
│   ├── export_excel_vp.js           # Script xuất Excel độc lập
│   └── sync_tl_loai_clean.js        # Script làm sạch và đồng bộ tài liệu loại
├── .env.example                     # File mẫu biến môi trường
├── .gitignore                       # Danh mục loại trừ Git (node_modules, .env, ảnh tạm...)
├── package.json                     # Quản lý dependency độc lập (sharp, exceljs, xlsx, dotenv)
└── README.md                        # Tài liệu hướng dẫn sử dụng chi tiết
```

---

## 📜 Quy Chuẩn Nghiệp Vụ Cốt Lõi (Tóm Tắt)

1. **Nguyên tắc bấm ghim:** Văn bản bấm chung 1 ghim kim/kẹp thì chỉ ghi là 1 dòng văn bản trong mục lục, số tờ tính từ trang đầu đến trang phụ lục cuối cùng trước vết ghim tiếp theo.
2. **Nguyên tắc tài liệu loại:** Mọi văn bản có chữ viết tay *"trùng"*, *"photo"*, hoặc bản scan thừa/hỏng phải được tách riêng khỏi mục lục chính và ghi vào sổ theo dõi tài liệu loại.
3. **Nguyên tắc dải tờ liên tục:** Dải số tờ `toSo` bắt buộc liên tục `01 -> N`, không đứt đoạn, không lặp lại số tờ.
4. **Nguyên tắc trích yếu:** Giữ nguyên văn trích yếu chuẩn, bổ sung danh từ nhân thân (`ông`, `bà`, `đ/c`...) nếu là quyết định/thông báo cá nhân.
5. **Nguyên tắc cột ghi chú:** Cột `ghiChu` trong file Excel mục lục nghiệm thu luôn để rỗng `""`.

---

## 🤝 Đóng Góp & Phát Triển

1. Fork kho mã nguồn về tài khoản cá nhân.
2. Tạo nhánh tính năng mới (`git checkout -b feature/tinh-nang-moi`).
3. Commit các thay đổi (`git commit -m 'Thêm tính năng...'`).
4. Push lên nhánh cá nhân (`git push origin feature/tinh-nang-moi`).
5. Mở Pull Request để cùng thảo luận và cải tiến.

---

## 📄 Bản Quyền (License)

Dự án được phân phối dưới giấy phép **MIT License**. Mọi cá nhân, cơ quan, đơn vị lưu trữ đều có thể tự do sử dụng, chỉnh sửa và triển khai phục vụ công tác số hóa tài liệu hành chính.
