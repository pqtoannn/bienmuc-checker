#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { exportJsonToExcel } from "../lib/excel-export-vp.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
=============================================================================
  CÔNG CỤ XUẤT EXCEL BIÊN MỤC HỒ SƠ KHỐI VĂN PHÒNG (VP / UBND)
=============================================================================
Cách sử dụng:
  node scripts/export_excel_vp.js <duong-dan-file.json> [duong-dan-file-xuat.xlsx]

Ví dụ:
  node scripts/export_excel_vp.js examples/mau_bien_muc_vp.json
  node scripts/export_excel_vp.js data_hs01.json output/HS01_BienMuc.xlsx

Định dạng JSON yêu cầu:
  {
    "donViCapTren": "UBND huyện...",
    "donVi": "UBND xã...",
    "soKyHieuHoSo": "01",
    "tenHoSo": "Tiêu đề hồ sơ...",
    "namGiaiDoan": "2024",
    "rows": [
      {
        "soTT": "1",
        "soKyHieuVanBan": "01/QĐ-UBND",
        "ngayThangVanBan": "15/04/2024",
        "tenLoaiTrichYeu": "Quyết định về việc...",
        "tacGiaVanBan": "UBND xã...",
        "toSoTrangSo": "01-03",
        "loaiBan": "Bản gốc",
        "ghiChu": ""
      }
    ],
    "rowsTrung": []
  }
=============================================================================
`);
    process.exit(args.length === 0 ? 1 : 0);
  }

  const inputPath = args[0];
  const outputPath = args[1] || "";

  try {
    console.log(`\n⏳ Đang đọc file JSON: ${inputPath}...`);
    const startTime = Date.now();

    const result = await exportJsonToExcel(inputPath, outputPath);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n✅ XUẤT FILE EXCEL THÀNH CÔNG (${duration}s)!`);
    console.log(`-----------------------------------------------------------------------------`);
    console.log(`  📄 Tên file:     ${result.fileName}`);
    console.log(`  📁 Đường dẫn:    ${result.fullPath}`);
    console.log(`  📊 Số văn bản:   ${result.rowCount} dòng (Mục lục văn bản)`);
    if (result.trungCount > 0) {
      console.log(`  🗑️ Tài liệu loại:${result.trungCount} dòng (Sheet Tài liệu loại)`);
    }
    console.log(`  💾 Dung lượng:   ${(result.fileSize / 1024).toFixed(1)} KB`);
    console.log(`-----------------------------------------------------------------------------\n`);
  } catch (err) {
    console.error(`\n❌ LỖI KHI XUẤT EXCEL:`, err.message);
    process.exit(1);
  }
}

main();
