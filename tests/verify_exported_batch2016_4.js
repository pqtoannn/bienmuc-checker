import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_TL_LOAI = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/Tl_loại_VP_Toàn_PL.xlsx';

async function verifyExcel(filePath, expectedRows, expectedFinalSheet) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  console.log(`\nVerifying ${path.basename(filePath)} (${ws.name})...`);
  const activeRows = [];
  for (let r = 7; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    if (!stt) continue;
    const so = row.getCell(2).text?.trim();
    const d = row.getCell(3).text?.trim();
    const ty = row.getCell(4).text?.trim();
    const tg = row.getCell(5).text?.trim();
    const toSo = row.getCell(6).text?.trim();
    const loaiBan = row.getCell(7).text?.trim();
    const ghiChu = row.getCell(8).text?.trim();

    activeRows.push({ r, stt, so, d, ty, tg, toSo, loaiBan, ghiChu });
  }

  if (activeRows.length !== expectedRows) {
    throw new Error(`Row count mismatch: got ${activeRows.length}, expected ${expectedRows}`);
  }

  let lastEnd = 0;
  for (let i = 0; i < activeRows.length; i++) {
    const row = activeRows[i];
    if (String(i + 1) !== row.stt) {
      throw new Error(`STT sequence broken at row ${i + 1}: got ${row.stt}`);
    }
    if (row.ghiChu !== '') {
      throw new Error(`ghiChu is not empty at row ${i + 1}: ${row.ghiChu}`);
    }
    const parts = row.toSo.split('-').map(p => parseInt(p, 10));
    const s = parts[0];
    const e = parts.length > 1 ? parts[1] : parts[0];

    if (s !== lastEnd + 1) {
      throw new Error(`Sheet gap/overlap at row ${i + 1} (${row.stt}): prevEnd=${lastEnd}, start=${s}, range=${row.toSo}`);
    }
    lastEnd = e;
  }

  if (lastEnd !== expectedFinalSheet) {
    throw new Error(`Final sheet mismatch: got ${lastEnd}, expected ${expectedFinalSheet}`);
  }

  console.log(`PASSED: ${activeRows.length} active rows, sheets 01 to ${lastEnd} perfectly continuous and gapless.`);
}

async function verifyTlLoai() {
  console.log('\nVerifying Tl_loại_VP_Toàn_PL.xlsx...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(P_TL_LOAI);
  const wsTrung = wb.getWorksheet('Trùng');
  if (!wsTrung) throw new Error('Sheet Trùng not found in Tl_loại_VP_Toàn_PL.xlsx');

  const rowsTrung = [];
  for (let r = 8; r <= wsTrung.rowCount; r++) {
    const row = wsTrung.getRow(r);
    const ten = row.getCell(3).text?.trim();
    const lyDo = row.getCell(5).text?.trim();
    if (ten || lyDo) {
      rowsTrung.push({ r, ten, lyDo });
    }
  }

  const check16H = rowsTrung.find(r => r.lyDo && r.lyDo.includes('PL_2016_16H'));
  if (!check16H) throw new Error('Duplicate record for PL_2016_16H missing in Tl_loại_VP_Toàn_PL.xlsx');
  console.log(`Found 16H duplicate sync: ${check16H.lyDo}`);

  const check16D_88 = rowsTrung.find(r => r.lyDo && r.lyDo.includes('088.jpg trùng ảnh 087.jpg'));
  if (!check16D_88) throw new Error('Duplicate 088.jpg for PL_2016_16D missing in Tl_loại_VP_Toàn_PL.xlsx');
  console.log(`Found 16D 088 duplicate sync: ${check16D_88.lyDo}`);

  const check16D_120 = rowsTrung.find(r => r.lyDo && r.lyDo.includes('120.jpg trùng ảnh 119.jpg'));
  if (!check16D_120) throw new Error('Duplicate 120.jpg for PL_2016_16D missing in Tl_loại_VP_Toàn_PL.xlsx');
  console.log(`Found 16D 120 duplicate sync: ${check16D_120.lyDo}`);

  const check16D_134 = rowsTrung.find(r => r.lyDo && r.lyDo.includes('134.jpg trùng ảnh 133.jpg'));
  if (!check16D_134) throw new Error('Duplicate 134.jpg for PL_2016_16D missing in Tl_loại_VP_Toàn_PL.xlsx');
  console.log(`Found 16D 134 duplicate sync: ${check16D_134.lyDo}`);

  console.log('PASSED: All Batch 2016-4 duplicates recorded in Tl_loại_VP_Toàn_PL.xlsx.');
}

async function run() {
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2016_16H.xlsx'), 109, 152);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2016_16H.xlsx'), 109, 152);

  await verifyExcel(path.join(P_DA_CHECK, 'PL_2016_16D.xlsx'), 128, 213);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2016_16D.xlsx'), 128, 213);

  await verifyTlLoai();

  console.log('\n======================================================');
  console.log('ALL VERIFICATIONS FOR BATCH 2016-4 PASSED WITH 100% SUCCESS!');
  console.log('======================================================\n');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
