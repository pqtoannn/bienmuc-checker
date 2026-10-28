import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const FONT_NAME = "Times New Roman";
export const FONT_SIZE = 13;

export const HEADERS_VP = [
  "STT",
  "Số, ký hiệu văn bản",
  "Ngày tháng năm văn bản",
  "Tên loại và trích yếu nội dung văn bản",
  "Tác giả văn bản",
  "Tờ số/ Trang số",
  "Loại văn bản",
  "Ghi chú",
];

export const INDEX_LABELS_VP = ["(1)", "(2)", "(3)", "(4)", "(5)", "(6)", "(7)", "(8)"];

export const COL_WIDTHS_VP = [8, 22, 16, 50, 28, 14, 18, 12];

export const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE8EDF4" },
};

export const THIN_BORDER = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

function cellFont(bold = false, size = FONT_SIZE, italic = false) {
  return { name: FONT_NAME, size, bold, italic };
}

function applyBorder(cell) {
  cell.border = THIN_BORDER;
}

function styleCell(cell, { bold = false, size = FONT_SIZE, italic = false, align = "left", vertical = "middle", wrap = false, border = true, fill = null } = {}) {
  cell.font = cellFont(bold, size, italic);
  cell.alignment = { horizontal: align, vertical, wrapText: wrap };
  if (fill) cell.fill = fill;
  if (border) applyBorder(cell);
}

function setMergedRow(
  ws,
  rowNum,
  colStart,
  colEnd,
  value,
  { bold = false, align = "center", bottom = null, size = FONT_SIZE, italic = false } = {}
) {
  ws.mergeCells(rowNum, colStart, rowNum, colEnd);
  const cell = ws.getCell(rowNum, colStart);
  cell.value = value ?? "";
  cell.font = { name: FONT_NAME, size, bold, italic };
  cell.alignment = { horizontal: align, vertical: "middle", wrapText: true };
  if (bottom) {
    cell.border = {
      bottom: { style: bottom },
    };
  }
}

// =============================================================================
// CÁC HÀM CHUẨN HÓA DỮ LIỆU ĐẦU VÀO (THEO CHUẨN BIENMUC CORE)
// =============================================================================

export function normalizeDateToDdMmYyyy(value) {
  if (value == null) return "";
  const trimmed = String(value).trim();
  if (!trimmed || /^[-—–]$/.test(trimmed)) return "";

  const slashMatch = trimmed.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (slashMatch) {
    const [, d, m, y] = slashMatch;
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }

  const vnMatch = trimmed.match(
    /(?:ngày\s*)?(\d{1,2})\s*tháng\s*(\d{1,2})\s*năm\s*(\d{4})/i
  );
  if (vnMatch) {
    const [, d, m, y] = vnMatch;
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }

  return trimmed;
}

export function normalizeSoKyHieuVanBan(value) {
  if (value == null) return "";
  let s = String(value).trim();
  if (!s || /^[-—–]$/.test(s)) return "";
  // Bỏ nhãn / nhiễu dấu đỏ nếu OCR dính vào ô số
  s = s.replace(/^số\s*:\s*/i, "");
  s = s.replace(/\b(đến\s*số|số\s*đến|đến\s*ngày|chuyển\s*đến)\b.*$/i, "").trim();
  if (!s || /^[-—–]$/.test(s)) return "";
  s = s.replace(/\b(CT|CH|CD)\s+(\d{5,})\b/gi, (_, p, n) => `${p.toUpperCase()}${n}`);
  s = s.replace(/\s*\/\s*/g, "/");
  // Cắt khoảng quanh gạch số VB: "256 - BC/HU" -> "256-BC/HU", "NĐ - CP" -> "NĐ-CP"
  s = s.replace(/\s*[-–—]\s*/g, "-");
  return s.trim();
}

export function normalizeLoaiBan(val) {
  const s = String(val || "").trim().toLowerCase();
  if (!s) return "Bản gốc";
  if (
    s.includes("không mộc") ||
    s.includes("khong moc") ||
    s.includes("k.mộc") ||
    s.includes("k.moc") ||
    s.includes("kh mộc") ||
    s.includes("kh moc") ||
    s.includes("k mộc") ||
    s.includes("k moc")
  ) {
    return "Bản gốc không mộc";
  }
  if (s.includes("photo") || s.includes("bản sao") || s.includes("ban sao") || s === "sao") {
    return "Photo";
  }
  if (s.includes("chính") || s.includes("chinh")) return "Bản chính";
  if (s.includes("gốc") || s.includes("goc")) return "Bản gốc";
  return "Bản gốc";
}

function isImplausibleToSoRange(p1, p2) {
  const n1 = parseInt(String(p1).replace(/\D/g, ""), 10);
  const n2 = parseInt(String(p2).replace(/\D/g, ""), 10);
  if (!Number.isFinite(n1) || !Number.isFinite(n2)) return false;
  return Math.abs(n2 - n1) > 120;
}

function formatToSoRange(p1, p2) {
  const a = String(p1).replace(/\s+/g, "");
  const b = String(p2).replace(/\s+/g, "");
  if (isImplausibleToSoRange(a, b)) return "";
  return `${a}-${b}`;
}

export function normalizeToSoTrangSo(value) {
  if (value == null) return "";
  const trimmed = String(value).trim();
  if (!trimmed || /^[-—–]$/.test(trimmed)) return "";

  // Hai số rời cách nhau quá xa (mã viết tay khác, không phải tờ/trang): "2741 5120"
  const twoLoose = trimmed.match(/^(\d{3,4})\s+(\d{3,4})$/);
  if (twoLoose && isImplausibleToSoRange(twoLoose[1], twoLoose[2])) return "";

  // 1. Khoảng tờ/trang: "182-183", "182a-182b", "182a đến 182b"
  const rangeMatch =
    trimmed.match(/^(\d{1,4}\s*[a-zA-Z]{0,3})\s*[-–—~～/]\s*(\d{1,4}\s*[a-zA-Z]{0,3})$/u) ||
    trimmed.match(/^(\d{1,4}\s*[a-zA-Z]{0,3})\s*(?:đến|den|tới|toi|đên)\s*(\d{1,4}\s*[a-zA-Z]{0,3})$/iu);
  if (rangeMatch) {
    return formatToSoRange(rangeMatch[1], rangeMatch[2]);
  }

  // 2. Khoảng có tiền tố nhãn: "tờ 182a - 182b", "trang 01-05"
  const labeledRange = trimmed.match(
    /(?:tờ|trang|to|so)\s*[:.]?\s*(\d{1,4}\s*[a-zA-Z]{0,3})\s*[-–—~～/]\s*(\d{1,4}\s*[a-zA-Z]{0,3})\b/iu
  );
  if (labeledRange) {
    return formatToSoRange(labeledRange[1], labeledRange[2]);
  }

  // 3. Số đơn có chữ cái hoặc tiền tố
  const singleLabeled = trimmed.match(/(?:tờ|trang|to|so)\s*[:.]?\s*(\d{1,4}\s*[a-zA-Z]{0,3})\b/iu);
  if (singleLabeled) {
    return singleLabeled[1].replace(/\s+/g, "");
  }

  // 4. Số thuần tuý: "182", "01", "182a"
  const cleanSingle = trimmed.replace(/\s+/g, "");
  if (/^\d{1,4}[a-zA-Z]{0,3}$/.test(cleanSingle)) {
    return cleanSingle;
  }

  return trimmed;
}

export function normalizeTrichYeu(value) {
  if (value == null) return "";
  let text = String(value).trim().replace(/\s{2,}/g, " ");
  if (!text) return "";

  // Chuẩn hóa tiền tố "V/v:", "V/v", "Về việc" -> "về việc"
  text = text.replace(/^(?:v\s*\/\s*v|về\s+việc)\s*[:：\-–—]?\s*/iu, "về việc ");
  text = text.replace(/(\b[Qq]uyết\s+định|[Kk]ế\s+hoạch|[Bb]áo\s+cáo|[Tt]ờ\s+trình|[Tt]hông\s+báo|[Cc]ông\s+văn)\s+-\s+(?=về\s+việc)/giu, "$1 ");
  text = text.replace(/(\b[Qq]uyết\s+định|[Kk]ế\s+hoạch|[Bb]áo\s+cáo|[Tt]ờ\s+trình|[Tt]hông\s+báo|[Cc]ông\s+văn)\s+(?:v\s*\/\s*v|V\/v)\s*[:：\-–—]?\s*/gu, "$1 về việc ");

  // Viết hoa chữ cái đầu câu trích yếu
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return text.trim();
}

export function normalizeTacGiaHeader(value) {
  if (value == null) return "";
  let lines = String(value)
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => /[\p{L}\p{N}]/u.test(l))
    .filter((l) => !/^s[ốo]\s*[:：]/i.test(l));

  if (!lines.length) return "";

  // Nếu đã được nối bằng " - "
  if (lines.length === 1 && lines[0].includes(" - ")) {
    return lines[0];
  }

  // Ghép nhiều dòng cơ quan ban hành (Cơ quan cấp trên \n Ban/Phòng tham mưu)
  return lines.join("\n");
}

export function normalizeTieuDeNghiQuyet(value) {
  if (value == null) return "";
  return String(value)
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

export function renumberRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row, i) => ({
    ...row,
    soTT: String(i + 1),
  }));
}

/**
 * Tự động tính toán dải số tờ cho từng văn bản theo đúng chuẩn BienMuc.
 * Dòng i chỉ có số đơn "01", dòng tiếp theo là "04" -> dòng i thành "01-03".
 * Bất kỳ dòng nào đã có dấu gạch ngang (ví dụ "02-02a", "05-05a") -> giữ nguyên.
 */
export function calculateAutoPageRanges(rows, options = {}) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  const { autoFill = true, lastRowEnd = null } = options;

  if (!autoFill) {
    return rows.map((r) => ({ ...r }));
  }

  const result = rows.map((r) => ({ ...r }));

  for (let i = 0; i < result.length; i++) {
    if (result[i]?.isExcluded) continue;
    const raw = String(result[i].toSoTrangSo || "").trim();
    if (!raw) continue;

    // Đã có khoảng tờ (chứa dấu -) -> giữ nguyên
    if (raw.includes("-")) continue;

    const match = raw.match(/^(\d{1,4})([a-zA-Z]*)$/);
    if (!match) continue;

    const currentNum = parseInt(match[1], 10);
    const padLen = match[1].length;

    // Tìm dòng kế tiếp có số tờ hợp lệ
    let nextStartNum = null;
    let nextHasSuffix = false;
    for (let j = i + 1; j < result.length; j++) {
      if (result[j]?.isExcluded) continue;
      const nextRaw = String(result[j].toSoTrangSo || "").trim();
      if (!nextRaw) continue;
      const nextMatch = nextRaw.match(/^(\d{1,4})([a-zA-Z]*)/);
      if (nextMatch) {
        nextStartNum = parseInt(nextMatch[1], 10);
        nextHasSuffix = Boolean(nextMatch[2]);
        break;
      }
    }

    if (nextStartNum === null) {
      if (lastRowEnd) {
        const pureMatch = raw.match(/^(\d{1,4})([a-zA-Z]*)$/);
        if (pureMatch) {
          const num = parseInt(pureMatch[1], 10);
          const endNum = parseInt(String(lastRowEnd).replace(/\D/g, ""), 10);
          if (!isNaN(num) && !isNaN(endNum) && endNum > num) {
            const padLen = pureMatch[1].length;
            result[i].toSoTrangSo = `${raw}-${String(endNum).padStart(padLen, "0")}`;
          }
        }
      }
      continue;
    }

    if (!isNaN(nextStartNum)) {
      if (nextStartNum <= currentNum) {
        result[i].toSoTrangSo = raw;
      } else {
        const targetEndNum = nextHasSuffix ? nextStartNum : nextStartNum - 1;
        if (targetEndNum > currentNum) {
          result[i].toSoTrangSo = `${raw}-${String(targetEndNum).padStart(padLen, "0")}`;
        } else {
          result[i].toSoTrangSo = raw;
        }
      }
    }
  }

  return result;
}

export function normalizeBienMucData(data) {
  if (!data) return { rows: [], rowsTrung: [] };

  // Hỗ trợ trường hợp truyền file job.json (có bọc data bên trong)
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    data = {
      ...data.data,
      soKyHieuHoSo: data.data.soKyHieuHoSo || data.soHoSo || "",
    };
  }

  // Hỗ trợ trường hợp truyền thẳng một mảng rows: [ {...} ]
  if (Array.isArray(data)) {
    data = { rows: data };
  }

  let rawRows = Array.isArray(data.rows) ? data.rows : [];
  const rawRowsTrung = Array.isArray(data.rowsTrung) ? data.rowsTrung : [];

  // Lọc bỏ những dòng bị đánh dấu loại trừ (như ảnh bìa hồ sơ isExcluded = true)
  const activeRows = rawRows.filter((r) => {
    if (!r) return false;
    if (r.isExcluded) return false;
    return Boolean(
      String(r.tenLoaiTrichYeu || r.trichYeu || "").trim() ||
      String(r.soKyHieuVanBan || r.soKyHieu || r.so || "").trim() ||
      String(r.ngayThangVanBan || r.ngayThang || r.ngay || "").trim() ||
      String(r.toSoTrangSo || r.toSo || "").trim()
    );
  });
  if (activeRows.length > 0) {
    rawRows = activeRows;
  }

  const normRow = (row, i) => {
    const rawSoKyHieu = row.soKyHieuVanBan || row.soKyHieu || row.so || "";
    const rawNgay = row.ngayThangVanBan || row.ngayThang || row.ngay || "";
    const rawTrichYeu = row.tenLoaiTrichYeu || row.trichYeu || "";
    const rawTacGia = row.tacGiaVanBan || row.tacGia || "";
    const rawToSo = row.toSoTrangSo || row.toSo || "";

    const soKyHieu = normalizeSoKyHieuVanBan(rawSoKyHieu);
    const cleanedTacGia = normalizeTacGiaHeader(rawTacGia);
    const normLoai = normalizeLoaiBan(row.loaiBan);

    return {
      ...row,
      soTT: String(row.soTT ?? i + 1),
      soKyHieuVanBan: soKyHieu,
      ngayThangVanBan: normalizeDateToDdMmYyyy(rawNgay),
      tenLoaiTrichYeu: normalizeTrichYeu(rawTrichYeu),
      tacGiaVanBan: cleanedTacGia,
      toSoTrangSo: normalizeToSoTrangSo(rawToSo),
      loaiBan: normLoai,
      ghiChu: String(row.ghiChu || "").trim(),
    };
  };

  const normalizedRows = renumberRows(rawRows.map(normRow));
  const autoPageRows = calculateAutoPageRanges(normalizedRows, { fillMissing: false });

  const resolvedTitle = normalizeTieuDeNghiQuyet(
    data.tieuDeNghiQuyet || data.tenHoSo || ""
  );

  return {
    donViCapTren: String(data.donViCapTren || "").trim(),
    donVi: String(data.donVi || "").trim(),
    tenPhong: String(data.tenPhong || "").trim(),
    tenDuAn: String(data.tenDuAn || "").trim(),
    soKyHieuHoSo: String(data.soKyHieuHoSo || "").trim(),
    tenHoSo: resolvedTitle,
    tieuDeNghiQuyet: resolvedTitle,
    namGiaiDoan: String(data.namGiaiDoan || "").trim(),
    thoiGianHoSo: String(data.thoiGianHoSo || "").trim(),
    tongSoToText: String(data.tongSoToText || "").trim(),
    tapSo: String(data.tapSo || "1").trim(),
    thbq: String(data.thbq || "Vĩnh viễn").trim(),
    banTo: String(data.banTo || data.boPhan || "Văn phòng").trim(),
    rows: autoPageRows,
    rowsTrung: rawRowsTrung.map((r, i) => ({
      ...normRow(r, i),
      isTrung: true,
      soHoSo: r.soHoSo || String(data.soKyHieuHoSo || "").trim(),
      lyDoTrung: r.lyDoTrung || (data.soKyHieuHoSo ? `Trùng hồ sơ số ${data.soKyHieuHoSo}` : "Trùng lặp"),
    })),
  };
}

export function buildExcelFilename(data = {}) {
  const sanitize = (s) =>
    String(s || "")
      .replace(/[\\/*?:"<>|]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const title = sanitize(data.tieuDeNghiQuyet || data.tenHoSo);
  const so = sanitize(data.soKyHieuHoSo);

  if (title && so) {
    return `${title}_${so}.xlsx`;
  }
  if (title) {
    return `${title}.xlsx`;
  }
  if (so) {
    return `HoSo_${so}.xlsx`;
  }
  return "MucLuc_VanBan_VP.xlsx";
}

// =============================================================================
// SHEET PHỤ: TÀI LIỆU LOẠI / TRÙNG THỪA
// =============================================================================

export function addTaiLieuTrungSheet(wb, data) {
  const rowsTrung = Array.isArray(data.rowsTrung) ? data.rowsTrung : [];
  if (!rowsTrung.length) return null;

  const wsTrung = wb.addWorksheet("Tài liệu loại", {
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  wsTrung.columns = [
    { key: "colA", width: 4 },
    { key: "colB", width: 10 },
    { key: "colC", width: 58 },
    { key: "colD", width: 16 },
    { key: "colE", width: 26 },
    { key: "colF", width: 22 },
  ];

  const donVi = String(data.donVi || data.tenPhong || data.tenDuAn || "").trim();
  const banTo = String(data.banTo || data.boPhan || "Văn phòng").trim();
  const soHoSoCurrent = String(data.soKyHieuHoSo || "").trim();

  // Dòng 1: DANH MỤC TÀI LIỆU LOẠI
  setMergedRow(wsTrung, 1, 2, 6, "DANH MỤC TÀI LIỆU LOẠI", {
    bold: true,
    align: "center",
    size: 14,
  });
  wsTrung.getRow(1).height = 26;

  // Dòng 2: PHÔNG: ...
  setMergedRow(wsTrung, 2, 2, 6, `PHÔNG: ${donVi || "Ủy ban nhân dân"}`, {
    bold: true,
    align: "center",
    size: 12,
  });
  wsTrung.getRow(2).height = 20;

  // Dòng 3: Ban/Tổ: ...
  setMergedRow(wsTrung, 3, 2, 6, `Ban/Tổ: ${banTo}`, {
    align: "center",
    size: 12,
  });
  wsTrung.getRow(3).height = 20;

  // Dòng 4: dòng trống
  wsTrung.getRow(4).height = 12;

  // Dòng 5: Tiêu đề các cột
  const headers = [
    { col: 2, text: "Tập số" },
    { col: 3, text: "Tiêu đề hồ sơ/tài liệu loại" },
    { col: 4, text: "THBQ" },
    { col: 5, text: "Lý do huỷ" },
    { col: 6, text: "Ghi chú" },
  ];

  headers.forEach(({ col, text }) => {
    const cell = wsTrung.getCell(5, col);
    cell.value = text;
    cell.font = { name: FONT_NAME, size: 12, bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    applyBorder(cell);
  });
  wsTrung.getRow(5).height = 28;

  // Dòng 6: NHÓM TÀI LIỆU TRÙNG THỪA
  setMergedRow(wsTrung, 6, 2, 6, "NHÓM TÀI LIỆU TRÙNG THỪA", {
    bold: true,
    align: "center",
    size: 12,
  });
  for (let c = 2; c <= 6; c++) {
    applyBorder(wsTrung.getCell(6, c));
  }
  wsTrung.getRow(6).height = 24;

  // Dòng 7+: Các tài liệu trùng / loại
  let rowNum = 7;
  rowsTrung.forEach((row) => {
    const targetSoHoSo = String(row.soHoSo || soHoSoCurrent || "").trim();
    let lyDoHuy = String(row.lyDoTrung || "").trim();
    if (!lyDoHuy || lyDoHuy === "Trùng lặp") {
      lyDoHuy = targetSoHoSo ? `Trùng hồ sơ số ${targetSoHoSo}` : "Trùng lặp";
    } else if (!lyDoHuy.startsWith("Trùng hồ sơ số") && targetSoHoSo) {
      lyDoHuy = `Trùng hồ sơ số ${targetSoHoSo}`;
    }

    const rowValues = [
      { col: 2, val: data.tapSo || "1", align: "center", wrap: false },
      { col: 3, val: row.tenLoaiTrichYeu || "", align: "left", wrap: true },
      { col: 4, val: row.thbq || data.thbq || "Vĩnh viễn", align: "center", wrap: false },
      { col: 5, val: lyDoHuy, align: "center", wrap: true },
      { col: 6, val: row.ghiChu || "", align: "left", wrap: true },
    ];

    rowValues.forEach(({ col, val, align, wrap }) => {
      const cell = wsTrung.getCell(rowNum, col);
      cell.value = val ?? "";
      cell.font = { name: FONT_NAME, size: 12 };
      cell.alignment = { horizontal: align, vertical: "middle", wrapText: wrap };
      applyBorder(cell);
    });

    wsTrung.getRow(rowNum).height = 28;
    rowNum += 1;
  });

  wsTrung.views = [{ state: "frozen", ySplit: 6 }];
  return wsTrung;
}

// =============================================================================
// HÀM XUẤT EXCEL CHÍNH CHO KHỐI VĂN PHÒNG (VP / UBND)
// =============================================================================

export async function buildBienMucExcel(inputData) {
  const data = normalizeBienMucData(inputData);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Mục lục văn bản", {
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  ws.columns = COL_WIDTHS_VP.map((width, i) => ({
    key: `col${i}`,
    width,
  }));

  let rowNum = 1;

  // Dòng 1: MỤC LỤC VĂN BẢN, TÀI LIỆU
  setMergedRow(ws, rowNum, 1, 8, "MỤC LỤC VĂN BẢN, TÀI LIỆU", { bold: true, align: "center" });
  ws.getRow(rowNum).height = 24;
  rowNum += 1;

  // Dòng tiêu đề hồ sơ
  const subtitleLines = (data.tieuDeNghiQuyet || data.tenHoSo || "")
    .trim()
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of subtitleLines) {
    setMergedRow(ws, rowNum, 1, 8, line, { bold: true, align: "center" });
    ws.getRow(rowNum).height = 22;
    rowNum += 1;
  }

  const soHoSo = (data.soKyHieuHoSo || "").trim();
  const nam = (data.namGiaiDoan || "").trim();

  // Dòng Số, ký hiệu hồ sơ
  setMergedRow(
    ws,
    rowNum,
    1,
    8,
    `Số, ký hiệu hồ sơ: ${soHoSo || ".........."}`,
    { align: "center" }
  );
  rowNum += 1;

  // Dòng Năm
  const hasExtraMeta = Boolean(data.thoiGianHoSo || data.tongSoToText);
  setMergedRow(
    ws,
    rowNum,
    1,
    8,
    `Năm ${nam || "............"}`,
    { align: "center", bottom: hasExtraMeta ? undefined : "thin" }
  );
  rowNum += 1;

  // Dòng thời gian hồ sơ (nếu có)
  if (data.thoiGianHoSo) {
    setMergedRow(ws, rowNum, 1, 8, data.thoiGianHoSo, { italic: true, align: "center" });
    ws.getRow(rowNum).height = 20;
    rowNum += 1;
  }

  // Dòng tổng số tờ (nếu có)
  if (data.tongSoToText) {
    setMergedRow(ws, rowNum, 1, 8, data.tongSoToText, { bold: true, align: "center", bottom: "thin" });
    ws.getRow(rowNum).height = 22;
    rowNum += 1;
  }

  // Hàng tiêu đề cột
  const headerRowNum = rowNum;
  HEADERS_VP.forEach((text, i) => {
    const cell = ws.getCell(headerRowNum, i + 1);
    cell.value = text;
    styleCell(cell, { bold: true, align: "center", wrap: true, fill: HEADER_FILL });
  });
  ws.getRow(headerRowNum).height = 36;
  rowNum += 1;

  // Hàng nhãn số chỉ mục (1) -> (8)
  const indexRowNum = rowNum;
  INDEX_LABELS_VP.forEach((text, i) => {
    const cell = ws.getCell(indexRowNum, i + 1);
    cell.value = text;
    styleCell(cell, { bold: true, align: "center", fill: HEADER_FILL });
  });
  ws.getRow(indexRowNum).height = 20;
  rowNum += 1;

  // Các dòng dữ liệu văn bản
  for (const row of data.rows || []) {
    const values = [
      row.soTT,
      row.soKyHieuVanBan,
      row.ngayThangVanBan,
      row.tenLoaiTrichYeu,
      row.tacGiaVanBan,
      row.toSoTrangSo,
      row.loaiBan || "Bản gốc",
      row.ghiChu,
    ];

    values.forEach((val, i) => {
      const cell = ws.getCell(rowNum, i + 1);
      cell.value = val ?? "";
      styleCell(cell, {
        align: i === 0 || i === 1 || i === 2 || i === 5 || i === 6 ? "center" : "left",
        wrap: i === 3 || i === 4,
      });
      cell.alignment = {
        ...cell.alignment,
        vertical: i === 3 || i === 4 ? "top" : "middle",
      };
    });
    rowNum += 1;
  }

  // Đóng băng tiêu đề bảng tại dòng số chỉ mục (1)-(8)
  ws.views = [{ state: "frozen", ySplit: indexRowNum }];

  // Thêm sheet tài liệu loại nếu có
  addTaiLieuTrungSheet(wb, data);

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Hàm tiện ích: Xuất trực tiếp từ file JSON hoặc object JSON ra file .xlsx trên ổ đĩa
 * @param {string | object} inputJson Đường dẫn file .json hoặc object JSON
 * @param {string} [outputPath] Đường dẫn file .xlsx xuất ra (hoặc thư mục đích)
 */
export async function exportJsonToExcel(inputJson, outputPath = "") {
  let rawData;
  let sourceFileName = "";

  if (typeof inputJson === "string") {
    const resolvedPath = path.resolve(inputJson);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Không tìm thấy file JSON nguồn: ${resolvedPath}`);
    }
    const content = fs.readFileSync(resolvedPath, "utf-8");
    rawData = JSON.parse(content);
    sourceFileName = path.basename(resolvedPath, path.extname(resolvedPath));
  } else if (typeof inputJson === "object" && inputJson !== null) {
    rawData = inputJson;
  } else {
    throw new Error("Dữ liệu đầu vào phải là đường dẫn file JSON hoặc JSON object.");
  }

  const normalized = normalizeBienMucData(rawData);
  const buffer = await buildBienMucExcel(normalized);

  let targetFilePath = outputPath;
  const suggestedName = buildExcelFilename({
    ...normalized,
    tenHoSo: normalized.tenHoSo || sourceFileName,
  });

  if (!targetFilePath) {
    targetFilePath = path.resolve(process.cwd(), suggestedName);
  } else {
    targetFilePath = path.resolve(targetFilePath);
    if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).isDirectory()) {
      targetFilePath = path.join(targetFilePath, suggestedName);
    }
  }

  const parentDir = path.dirname(targetFilePath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  fs.writeFileSync(targetFilePath, buffer);

  return {
    success: true,
    fullPath: targetFilePath,
    fileName: path.basename(targetFilePath),
    rowCount: normalized.rows.length,
    trungCount: normalized.rowsTrung.length,
    fileSize: buffer.length,
  };
}
