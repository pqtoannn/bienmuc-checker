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

  console.log(`Parsed ${dataRows.length} data rows (expected ${expectedRows})`);
  if (dataRows.length !== expectedRows) {
    throw new Error(`Row count mismatch: expected ${expectedRows}, got ${dataRows.length}`);
  }

  // Check continuity of toSo
  let lastEnd = 0;
  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    const toSo = r.toSo;
    let s, e;
    if (toSo.includes('-')) {
      const parts = toSo.split('-');
      s = parseInt(parts[0], 10);
      e = parseInt(parts[1], 10);
    } else {
      s = parseInt(toSo, 10);
      e = s;
    }

    if (s !== lastEnd + 1) {
      throw new Error(`GAP at row ${i + 1} (STT ${r.stt}): expected ${lastEnd + 1}, got ${s} (toSo: "${toSo}")`);
    }
    lastEnd = e;

    // Verify ghiChu is empty
    if (r.ghiChu !== '') {
      throw new Error(`ghiChu is NOT empty at row ${i + 1}: "${r.ghiChu}"`);
    }
  }

  if (lastEnd !== expectedLastSheet) {
    throw new Error(`Last sheet mismatch: expected ${expectedLastSheet}, got ${lastEnd}`);
  }

  console.log(`PASSED: ${dataRows.length} rows, sheets 01 to ${lastEnd} 100% continuous with 0 gaps!`);
}

async function main() {
  await verifyExcel(path.join(DA_CHECK_DIR, 'PL_2020_20E.xlsx'), 8, 31);
  await verifyExcel(path.join(OUTPUT_OCR_DIR, 'PL_2020_20E.xlsx'), 8, 31);

  await verifyExcel(path.join(DA_CHECK_DIR, 'PL_2020_20F.xlsx'), 147, 176);
  await verifyExcel(path.join(OUTPUT_OCR_DIR, 'PL_2020_20F.xlsx'), 147, 176);

  console.log('\n========================================');
  console.log('BATCH 2020-3 VERIFICATION 100% SUCCESSFUL!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
