import fs from 'fs';
import ExcelJS from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/exceljs/dist/es5/index.js';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

async function verifyExcel(filePath, expectedRows, expectedTotalSheets) {
  console.log(`\nVerifying ${filePath}...`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  let activeRows = 0;
  let lastEnd = 0;
  let errors = 0;

  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;

    if (stt && !isNaN(Number(stt))) {
      activeRows++;
      const soHieu = row.getCell(2).text ? row.getCell(2).text.trim() : '';
      const ngay = row.getCell(3).text ? row.getCell(3).text.trim() : '';
      const trichYeu = row.getCell(4).text ? row.getCell(4).text.trim() : '';
      const tacGia = row.getCell(5).text ? row.getCell(5).text.trim() : '';
      const toSo = row.getCell(6).text ? row.getCell(6).text.trim() : '';
      const loaiBan = row.getCell(7).text ? row.getCell(7).text.trim() : '';
      const ghiChu = row.getCell(8).text ? row.getCell(8).text.trim() : '';

      // Check ghiChu is empty
      if (ghiChu !== '') {
        console.error(`Row ${activeRows} has non-empty ghiChu: '${ghiChu}'`);
        errors++;
      }

      // Check toSo
      let s, e;
      if (toSo.includes('-')) {
        const parts = toSo.split('-').map(Number);
        s = parts[0];
        e = parts[1];
      } else {
        s = Number(toSo);
        e = Number(toSo);
      }

      if (s !== lastEnd + 1) {
        console.error(`GAP ERROR at row ${activeRows} (STT ${stt}): expected start ${lastEnd + 1}, got ${s} (toSo='${toSo}')`);
        errors++;
      }
      lastEnd = e;

      // Sample check
      if (activeRows <= 4 || activeRows >= expectedRows - 4) {
        console.log(`  Row ${String(activeRows).padStart(3)} | STT: ${stt} | ToSo: ${toSo.padEnd(8)} | So: ${soHieu.padEnd(16)} | Ngay: ${ngay.padEnd(10)} | TrichYeu: ${trichYeu.slice(0, 35)}`);
      }
    }
  }

  if (activeRows !== expectedRows) {
    console.error(`Row count mismatch: expected ${expectedRows}, got ${activeRows}`);
    errors++;
  }
  if (lastEnd !== expectedTotalSheets) {
    console.error(`End sheet mismatch: expected ${expectedTotalSheets}, got ${lastEnd}`);
    errors++;
  }

  if (errors === 0) {
    console.log(`[PASS] ${filePath}: ${activeRows} rows, sheets 1 to ${lastEnd}, 0 gaps, all checks passed!`);
  } else {
    throw new Error(`[FAIL] ${filePath} had ${errors} errors!`);
  }
}

async function run() {
  await verifyExcel(`${DA_CHECK_DIR}/PL_2019_19K.xlsx`, 98, 131);
  await verifyExcel(`${OUTPUT_OCR_DIR}/PL_2019_19K.xlsx`, 98, 131);
  await verifyExcel(`${DA_CHECK_DIR}/PL_2019_19L.xlsx`, 12, 30);
  await verifyExcel(`${OUTPUT_OCR_DIR}/PL_2019_19L.xlsx`, 12, 30);
  console.log('\n>>> ALL BATCH 2019-5 VERIFICATIONS PASSED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err.message);
  process.exit(1);
});
