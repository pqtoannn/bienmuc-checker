import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import config from "../config/index.js";

export const DEFAULT_TL_LOAI_PATH = config.paths.taiLieuLoaiFile;

const FONT_NAME = "Times New Roman";

/**
 * Khởi tạo template file Tl_loại nếu file chưa tồn tại
 */
export async function initTaiLieuLoaiTemplate(targetFilePath) {
  const dir = path.dirname(targetFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const wb = new ExcelJS.Workbook();

  // Sheet 1: Trùng
  const wsTrung = wb.addWorksheet("Trùng");
  wsTrung.getCell("A1").value = "DANH MỤC TÀI LIỆU LOẠI";
  wsTrung.getCell("A2").value = `PHÔNG: ${config.archive.phong || "UBND Xã Phú Lộc"}`;
  wsTrung.getCell("A3").value = `Ban/Tổ: ${config.archive.banTo || "Văn phòng"}`;

  const headersTrung = ["Bó số", "Tập số", "Tiêu đề hồ sơ/tài liệu loại", "THBQ", "Lý do huỷ", "Ghi chú"];
  const hRowTrung = wsTrung.getRow(5);
  headersTrung.forEach((h, idx) => {
    const c = hRowTrung.getCell(idx + 1);
    c.value = h;
    c.font = { name: FONT_NAME, size: 12, bold: true };
    c.alignment = { horizontal: "center", vertical: "middle" };
    c.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  wsTrung.getCell("A6").value = "B. NHÓM TÀI LIỆU KHÔNG CÓ GIÁ TRỊ LƯU TRỮ";
  wsTrung.getCell("A6").font = { name: FONT_NAME, size: 12, bold: true, italic: true };

  // Set column widths
  wsTrung.getColumn(1).width = 10;
  wsTrung.getColumn(2).width = 10;
  wsTrung.getColumn(3).width = 65;
  wsTrung.getColumn(4).width = 15;
  wsTrung.getColumn(5).width = 30;
  wsTrung.getColumn(6).width = 15;

  // Sheet 2: Photo
  const wsPhoto = wb.addWorksheet("Photo");
  wsPhoto.getCell("A1").value = "B. NHÓM TÀI LIỆU KHÔNG CÓ GIÁ TRỊ LƯU TRỮ";
  wsPhoto.getCell("A1").font = { name: FONT_NAME, size: 12, bold: true, italic: true };

  const headersPhoto = ["Bó số", "Tập số", "Tiêu đề hồ sơ/tài liệu loại", "THBQ", "Lý do huỷ", "Ghi chú"];
  const hRowPhoto = wsPhoto.getRow(1);
  // header at row 1 for Photo
  headersPhoto.forEach((h, idx) => {
    const c = hRowPhoto.getCell(idx + 1);
    c.value = h;
    c.font = { name: FONT_NAME, size: 12, bold: true };
    c.alignment = { horizontal: "center", vertical: "middle" };
    c.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  wsPhoto.getColumn(1).width = 10;
  wsPhoto.getColumn(2).width = 10;
  wsPhoto.getColumn(3).width = 65;
  wsPhoto.getColumn(4).width = 15;
  wsPhoto.getColumn(5).width = 25;
  wsPhoto.getColumn(6).width = 15;

  await wb.xlsx.writeFile(targetFilePath);
  console.log(`Đã khởi tạo file template tài liệu loại tại: ${targetFilePath}`);
}

/**
 * Thêm một dòng tài liệu loại (Trùng hoặc Photo) vào file Tl_loại_VP_Toàn_PL.xlsx
 * @param {Object} item Thông tin tài liệu loại cần thêm
 * @param {('trung'|'photo')} item.type Loại tài liệu: 'trung' hoặc 'photo'
 * @param {string} item.tenVanBan Tiêu đề/tên loại trích yếu của văn bản
 * @param {string} [item.soHoSo] Mã hồ sơ đang kiểm tra (ví dụ: 'PL_2023_23F')
 * @param {string} [item.lyDoTrung] Lý do trùng (nếu để trống, tự động sinh: 'Trùng hs <soHoSo>')
 * @param {string} [item.thbq] Thời hạn bảo quản (mặc định: 'Vĩnh viễn')
 * @param {string} [targetFilePath] Đường dẫn tới file Tl_loại_VP_Toàn_PL.xlsx
 */
export async function appendTaiLieuLoai(item, targetFilePath = DEFAULT_TL_LOAI_PATH) {
  if (!fs.existsSync(targetFilePath)) {
    await initTaiLieuLoaiTemplate(targetFilePath);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetFilePath);

  const isPhoto = item.type === "photo";
  const sheetName = isPhoto ? "Photo" : "Trùng";
  const ws = wb.getWorksheet(sheetName);

  if (!ws) {
    throw new Error(`Không tìm thấy sheet '${sheetName}' trong file ${targetFilePath}`);
  }

  // Xác định dòng đầu tiên có cột Tiêu đề (cột 3) còn trống
  const startRow = isPhoto ? 2 : 7;
  let nextRow = startRow;
  while (true) {
    const r = ws.getRow(nextRow);
    const col3Val = r.getCell(3).value;
    if (!col3Val || col3Val.toString().trim() === "") {
      break;
    }
    nextRow++;
  }

  if (isPhoto) {
    if (nextRow < 2) nextRow = 2;
    const row = ws.getRow(nextRow);
    row.getCell(1).value = 1;
    row.getCell(2).value = 1;
    row.getCell(3).value = item.tenVanBan || "";
    row.getCell(4).value = item.thbq || "Vĩnh viễn";
    row.getCell(5).value = "Không có giá trị";
    row.getCell(6).value = "Photo";

    for (let c = 1; c <= 6; c++) {
      const cell = row.getCell(c);
      cell.font = { name: FONT_NAME, size: 12 };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = {
        horizontal: c === 3 ? "left" : "center",
        vertical: "middle",
        wrapText: c === 3,
      };
    }
  } else {
    if (nextRow < 7) nextRow = 7;
    const lyDo = item.lyDoTrung || (item.soHoSo ? `Trùng hs ${item.soHoSo}` : "Trùng lặp");
    const row = ws.getRow(nextRow);
    row.getCell(1).value = 1;
    row.getCell(2).value = 1;
    row.getCell(3).value = item.tenVanBan || "";
    row.getCell(4).value = item.thbq || "Vĩnh viễn";
    row.getCell(5).value = lyDo;
    row.getCell(6).value = "";

    for (let c = 1; c <= 6; c++) {
      const cell = row.getCell(c);
      cell.font = { name: FONT_NAME, size: 12 };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = {
        horizontal: c === 3 ? "left" : "center",
        vertical: "middle",
        wrapText: c === 3,
      };
    }
  }

  await wb.xlsx.writeFile(targetFilePath);
  console.log(`[Đồng bộ Tl_loại] Đã ghi nhận [${item.type.toUpperCase()}] vào dòng ${nextRow} (${sheetName}): ${item.tenVanBan?.slice(0, 50)}...`);
}
