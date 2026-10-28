import fs from 'fs';
import path from 'path';
import ExcelJS from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/exceljs/dist/es5/index.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

async function verifyExcel(filePath, expectedRows, expectedEndSheet) {
  console.log(`\nVerifying ${path.basename(filePath)}...`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    throw new Error(`File is empty: ${filePath}`);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  if (!ws) {
    throw new Error(`No worksheet found in ${filePath}`);
  }

  let dataStartRow = -1;
  for (let r = 1; r <= 20; r++) {
    const val = ws.getRow(r).getCell(1).value;
    if (val === 1 || val === '1') {
      dataStartRow = r;
      break;
    }
  }

  if (dataStartRow === -1) {
    throw new Error(`Data start row not found in ${filePath}`);
  }

  console.log(`  Data starts at row: ${dataStartRow}`);

  let lastEnd = 0;
  let activeCount = 0;

  for (let r = dataStartRow; ; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (!stt || String(stt).trim() === '' || isNaN(Number(stt))) {
      break;
    }

    activeCount++;
    const soHieu = row.getCell(2).text ? row.getCell(2).text.trim() : '';
    const ngay = row.getCell(3).text ? row.getCell(3).text.trim() : '';
    const trichYeu = row.getCell(4).text ? row.getCell(4).text.trim() : '';
    const tacGia = row.getCell(5).text ? row.getCell(5).text.trim() : '';
    const toSo = row.getCell(6).text ? row.getCell(6).text.trim() : '';
    const loaiBan = row.getCell(7).text ? row.getCell(7).text.trim() : '';
    const ghiChu = row.getCell(8).text ? row.getCell(8).text.trim() : '';

    if (!toSo) {
      throw new Error(`Row ${stt} has empty toSoTrangSo`);
    }

    let s, e;
    if (toSo.includes('-')) {
      const parts = toSo.split('-').map(p => parseInt(p.trim(), 10));
      s = parts[0];
      e = parts[1];
    } else {
      s = parseInt(toSo.trim(), 10);
      e = s;
    }

    if (s !== lastEnd + 1) {
      throw new Error(`Gap detected at row ${stt}: current start ${s} !== lastEnd + 1 (${lastEnd + 1})`);
    }
    if (e < s) {
      throw new Error(`Invalid range at row ${stt}: ${toSo}`);
    }
    lastEnd = e;

    if (ghiChu !== '') {
      throw new Error(`Row ${stt} has non-empty ghiChu: '${ghiChu}'`);
    }
    if (!trichYeu) {
      throw new Error(`Row ${stt} has empty trichYeu`);
    }
  }

  console.log(`  Active rows verified: ${activeCount}`);
  console.log(`  Final sheet verified: ${lastEnd}`);

  if (activeCount !== expectedRows) {
    throw new Error(`Expected ${expectedRows} rows, got ${activeCount}`);
  }
  if (lastEnd !== expectedEndSheet) {
    throw new Error(`Expected final sheet ${expectedEndSheet}, got ${lastEnd}`);
  }

  console.log(`  [OK] ${path.basename(filePath)} passed all checks!`);
}

async function run() {
  try {
    await verifyExcel(path.join(DA_CHECK_DIR, 'PL_2019_19E.xlsx'), 72, 177);
    await verifyExcel(path.join(OUTPUT_OCR_DIR, 'PL_2019_19E.xlsx'), 72, 177);

    await verifyExcel(path.join(DA_CHECK_DIR, 'PL_2019_19F.xlsx'), 1, 1);
    await verifyExcel(path.join(OUTPUT_OCR_DIR, 'PL_2019_19F.xlsx'), 1, 1);

    console.log('\n==========================================');
    console.log('BATCH 2019-3 VERIFICATION PASSED 100%!');
    console.log('==========================================');
  } catch (err) {
    console.error('\n[FAIL] Verification error:', err.message);
    process.exit(1);
  }
}

run();
