#!/usr/bin/env node
import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import config from "../config/index.js";
import { generateCornerGrids, cropTopRight, cropHeader } from "../lib/visual-inspector.js";
import { exportJsonToExcel } from "../lib/excel-export-vp.js";
import { appendTaiLieuLoai } from "../lib/tai-lieu-loai-sync.js";

function parseRange(str) {
  if (!str) return null;
  const cleaned = str.toString().trim().replace(/\s+/g, "");
  const m = cleaned.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const s = parseInt(m[1], 10);
  const e = m[2] ? parseInt(m[2], 10) : s;
  return { start: s, end: e };
}

async function handleGrid(dossierId) {
  if (!dossierId) {
    console.error("Lỗi: Vui lòng nhập mã hồ sơ (ví dụ: PL_2015_15D)");
    process.exit(1);
  }
  const dosDir = path.join(config.paths.photosDir, dossierId);
  if (!fs.existsSync(dosDir)) {
    console.error(`Không tìm thấy thư mục ảnh: ${dosDir}`);
    process.exit(1);
  }
  console.log(`Đang tạo lưới góc kiểm tra cho hồ sơ ${dossierId}...`);
  const files = await generateCornerGrids({
    dossierDir: dosDir,
    dossierId,
  });
  console.log(`Hoàn thành! Đã tạo ${files.length} file ảnh lưới tại:`);
  files.forEach((f) => console.log(` - ${f}`));
}

function handleVerify(dossierId) {
  if (!dossierId) {
    console.error("Lỗi: Vui lòng nhập mã hồ sơ cần kiểm tra (ví dụ: PL_2015_15D)");
    process.exit(1);
  }

  const fExcel = path.join(config.paths.outputExcelDir, `${dossierId}.xlsx`);
  if (!fs.existsSync(fExcel)) {
    console.error(`Không tìm thấy file Excel: ${fExcel}`);
    process.exit(1);
  }

  const wb = xlsx.readFile(fExcel);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let dataStartIdx = 5;
  for (let i = 4; i < 10; i++) {
    if (rows[i] && (rows[i][0] === "1" || rows[i][0] === 1)) {
      dataStartIdx = i;
      break;
    }
  }

  const dataRows = rows.slice(dataStartIdx);
  console.log(`\n======================================================`);
  console.log(`KIỂM ĐỊNH TÍNH TOÀN VẸN HỒ SƠ: ${dossierId}`);
  console.log(`- File kiểm tra: ${fExcel}`);
  console.log(`- Tổng số văn bản hoạt động: ${dataRows.length}`);

  let lastEnd = 0;
  let hasError = false;

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    const stt = parseInt(r[0], 10);
    if (stt !== i + 1) {
      console.error(`[LỖI] Dòng #${i + 1}: STT không khớp (${stt} !== ${i + 1})`);
      hasError = true;
    }

    const toSo = (r[5] || "").toString().trim();
    const pr = parseRange(toSo);
    if (!pr) {
      console.error(`[LỖI] Dòng #${i + 1} (${r[1]}): Dải tờ số không hợp lệ "${toSo}"`);
      hasError = true;
      continue;
    }

    if (i === 0 && pr.start !== 1) {
      console.error(`[LỖI] Văn bản đầu tiên không bắt đầu từ tờ 1 (bắt đầu từ ${pr.start})`);
      hasError = true;
    }

    if (i > 0 && pr.start !== lastEnd + 1) {
      console.error(`[LỖI LỖ HỔNG / CHỒNG CHÉO] Dòng #${i + 1} (${r[1]}): Bắt đầu từ tờ ${pr.start}, nhưng văn bản trước kết thúc tại tờ ${lastEnd}!`);
      hasError = true;
    }

    if (pr.end < pr.start) {
      console.error(`[LỖI ĐẢO CHIỀU] Dòng #${i + 1}: ${pr.start}-${pr.end}`);
      hasError = true;
    }

    const ghiChu = (r[7] || "").toString().trim();
    if (ghiChu !== "") {
      console.error(`[CẢNH BÁO Ô NHIỄM GHI CHÚ] Dòng #${i + 1}: cột Ghi chú có nội dung "${ghiChu}" (yêu cầu để trống hoàn toàn)`);
      hasError = true;
    }

    lastEnd = pr.end;
  }

  console.log(`- Tờ số kết thúc của hồ sơ: ${lastEnd}`);
  if (!hasError) {
    console.log(`=> KẾT LUẬN: ĐẠT 100% TIÊU CHUẨN LƯU TRỮ (Dãy số tờ 01 đến ${lastEnd} liên tục tuyệt đối, không lỗ hổng)!`);
  } else {
    console.error(`=> KẾT LUẬN: KHÔNG ĐẠT TIÊU CHUẨN! Cần rà soát và sửa lại dải số tờ.`);
    process.exit(1);
  }
}

function handleVerifyYear(year) {
  if (!year) {
    console.error("Lỗi: Vui lòng nhập năm cần kiểm tra (ví dụ: 2015, 2016, 2017)");
    process.exit(1);
  }

  const dir = config.paths.outputExcelDir;
  if (!fs.existsSync(dir)) {
    console.error(`Không tìm thấy thư mục: ${dir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.includes(`_${year}_`) && f.endsWith(".xlsx") && !f.startsWith("~$"))
    .sort();

  console.log(`\nTìm thấy ${files.length} hồ sơ năm ${year} tại: ${dir}`);
  let totalDocs = 0;
  let totalSheets = 0;
  let allPass = true;

  const summary = [];

  for (const f of files) {
    const dosId = path.basename(f, ".xlsx");
    const filePath = path.join(dir, f);
    const wb = xlsx.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let dataStartIdx = 5;
    for (let i = 4; i < 10; i++) {
      if (rows[i] && (rows[i][0] === "1" || rows[i][0] === 1)) {
        dataStartIdx = i;
        break;
      }
    }

    const dataRows = rows.slice(dataStartIdx);
    let lastEnd = 0;
    let ok = true;

    for (let i = 0; i < dataRows.length; i++) {
      const r = dataRows[i];
      const pr = parseRange(r[5]);
      if (!pr || (i === 0 && pr.start !== 1) || (i > 0 && pr.start !== lastEnd + 1)) {
        ok = false;
        break;
      }
      lastEnd = pr.end;
    }

    const title = rows[1] && rows[1][0] ? rows[1][0] : "";
    summary.push({
      Mã_Hồ_Sơ: dosId,
      Tiêu_Đề: title.slice(0, 30),
      Số_Văn_Bản: dataRows.length,
      Tờ_Kết_Thúc: lastEnd,
      Trạng_Thái: ok ? "PASS" : "FAIL",
    });

    if (!ok) allPass = false;
    totalDocs += dataRows.length;
    totalSheets += lastEnd;
  }

  console.table(summary);
  console.log(`Tổng số: ${files.length} hồ sơ | ${totalDocs} văn bản | ${totalSheets} tờ lưu trữ.`);
  if (allPass && files.length > 0) {
    console.log(`=> TẤT CẢ ${files.length} HỒ SƠ NĂM ${year} ĐỀU ĐẠT TIÊU CHUẨN XUẤT SẮC!`);
  }
}

async function handleSyncLoai(args) {
  const typeIdx = args.indexOf("--type");
  const docIdx = args.indexOf("--doc");
  const dosIdx = args.indexOf("--dos");
  const reasonIdx = args.indexOf("--reason");

  const type = typeIdx !== -1 ? args[typeIdx + 1] : "trung";
  const tenVanBan = docIdx !== -1 ? args[docIdx + 1] : "";
  const soHoSo = dosIdx !== -1 ? args[dosIdx + 1] : "";
  const lyDoTrung = reasonIdx !== -1 ? args[reasonIdx + 1] : undefined;

  if (!tenVanBan) {
    console.error("Lỗi: Thiếu tham số --doc <tên trích yếu văn bản loại>");
    process.exit(1);
  }

  await appendTaiLieuLoai({
    type,
    tenVanBan,
    soHoSo,
    lyDoTrung,
  });
}

function showHelp() {
  console.log(`
================================================================================
BIENMUC-CHECKER CLI - BỘ CÔNG CỤ SOÁT LỖI & BIÊN MỤC HỒ SƠ LƯU TRỮ VĂN PHÒNG
================================================================================

Cách sử dụng:
  node bin/bienmuc-cli.js <lệnh> [tham số...]

Các lệnh chính:
  1. Tạo lưới ảnh góc số tờ để đối chiếu thị giác (Corner Grid):
     node bin/bienmuc-cli.js grid <MÃ_HỒ_SƠ>
     Ví dụ: node bin/bienmuc-cli.js grid PL_2015_15D

  2. Kiểm định tính toàn vẹn & dải số tờ liên tục của một hồ sơ Excel:
     node bin/bienmuc-cli.js verify <MÃ_HỒ_SƠ>
     Ví dụ: node bin/bienmuc-cli.js verify PL_2015_15D

  3. Kiểm định hàng loạt toàn bộ hồ sơ của một năm:
     node bin/bienmuc-cli.js verify-year <NĂM>
     Ví dụ: node bin/bienmuc-cli.js verify-year 2015

  4. Đồng bộ thủ công một văn bản Trùng hoặc Photo vào file Tl_loại dùng chung:
     node bin/bienmuc-cli.js sync-loai --type <trung|photo> --doc "<Trích yếu>" --dos <Mã_hồ_sơ>
     Ví dụ: node bin/bienmuc-cli.js sync-loai --type trung --doc "Quyết định 149/QĐ-UBND" --dos PL_2015_15F

Cấu hình đường dẫn:
  Sửa file .env hoặc config/default.json để tùy chỉnh thư mục ảnh và thư mục xuất.
================================================================================
  `);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h" || command === "help") {
    showHelp();
    return;
  }

  switch (command) {
    case "grid":
      await handleGrid(args[1]);
      break;
    case "verify":
      handleVerify(args[1]);
      break;
    case "verify-year":
      handleVerifyYear(args[1]);
      break;
    case "sync-loai":
      await handleSyncLoai(args);
      break;
    default:
      console.error(`Lệnh không hợp lệ: "${command}"`);
      showHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Lỗi CLI:", err);
  process.exit(1);
});
