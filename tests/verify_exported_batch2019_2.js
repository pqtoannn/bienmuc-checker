import ExcelJS from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/exceljs/dist/es5/index.js';
import fs from 'fs';
import path from 'path';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

async function verifyExcel(filePath, expectedRows, expectedLastSheet) {
  console.log(`\nVerifying ${path.basename(filePath)}...`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  console.log(`Sheet name: ${ws.name}, Total rows: ${ws.rowCount}`);

  let headerRow = -1;
  for (let r = 1; r <= 15; r++) {
    const val = ws.getRow(r).getCell(1).value;
    if (val && String(val).trim() === '1') {
      headerRow = r - 1;
      break;
    }
  }

  if (headerRow === -1) {
    throw new Error('Could not find data starting row!');
  }

  const dataRows = [];
  for (let r = headerRow + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (stt === null || stt === undefined || String(stt).trim() === '') break;
    dataRows.push({
      rowIdx: r,
      stt: String(stt).trim(),
      soKyHieu: row.getCell(2).value ? String(row.getCell(2).value).trim() : '',
      ngayThang: row.getCell(3).value ? String(row.getCell(3).value).trim() : '',
      trichYeu: row.getCell(4).value ? String(row.getCell(4).value).trim() : '',
      tacGia: row.getCell(5).value ? String(row.getCell(5).value).trim() : '',
      toSo: row.getCell(6).value ? String(row.getCell(6).value).trim() : '',
      loaiBan: row.getCell(7).value ? String(row.getCell(7).value).trim() : '',
      ghiChu: row.getCell(8).value ? String(row.getCell(8).value).trim() : ''
    });
  }

  console.log(`Extracted ${dataRows.length} active data rows.`);
  if (dataRows.length !== expectedRows) {
    throw new Error(`Expected ${expectedRows} rows, but found ${dataRows.length}!`);
  }

  let lastEnd = 0;
  for (let i = 0; i < dataRows.length; i++) {
    const d = dataRows[i];

    if (d.ghiChu !== '') {
      throw new Error(`Row ${d.stt} has non-empty ghiChu: "${d.ghiChu}"`);
    }

    const m = d.toSo.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) {
      throw new Error(`Invalid toSoTrangSo format at row ${d.stt}: "${d.toSo}"`);
    }
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;

    if (start !== lastEnd + 1) {
      throw new Error(`GAP/OVERLAP at row ${d.stt}: prevEnd=${lastEnd}, start=${start} (${d.toSo})`);
    }
    lastEnd = end;
  }

  console.log(`Last sheet reached: ${lastEnd}. Expected: ${expectedLastSheet}.`);
  if (lastEnd !== expectedLastSheet) {
    throw new Error(`Last sheet mismatch: expected ${expectedLastSheet}, got ${lastEnd}`);
  }

  console.log(`[PASS] ${path.basename(filePath)} verified successfully with 0 gaps!`);
}

async function main() {
  await verifyExcel(path.join(DA_CHECK_DIR, 'PL_2019_19C.xlsx'), 2, 2);
  await verifyExcel(path.join(OUTPUT_OCR_DIR, 'PL_2019_19C.xlsx'), 2, 2);

  await verifyExcel(path.join(DA_CHECK_DIR, 'PL_2019_19D.xlsx'), 91, 168);
  await verifyExcel(path.join(OUTPUT_OCR_DIR, 'PL_2019_19D.xlsx'), 91, 168);

  console.log('\n======================================================');
  console.log('ALL BATCH 2019-2 EXCEL FILES VERIFIED SUCCESSFULLY!');
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
