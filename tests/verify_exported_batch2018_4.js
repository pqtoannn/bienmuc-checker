import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function verifyExcel(filePath, expectedRows, expectedTotalSheets) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  let headerRow = -1;
  ws.eachRow((row, rowNumber) => {
    const val = String(row.getCell(1).value || '').trim();
    if (val === 'Số TT' || val === '1' && headerRow === -1) {
      if (val === 'Số TT') headerRow = rowNumber;
    }
  });

  if (headerRow === -1) {
    headerRow = 5; // fallback standard
  }

  const rows = [];
  for (let r = headerRow + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = String(row.getCell(1).value || '').trim();
    if (!stt || isNaN(Number(stt))) continue;

    rows.push({
      stt: Number(stt),
      soKyHieu: String(row.getCell(2).value || '').trim(),
      ngayThang: String(row.getCell(3).value || '').trim(),
      trichYeu: String(row.getCell(4).value || '').trim(),
      tacGia: String(row.getCell(5).value || '').trim(),
      toSoTrangSo: String(row.getCell(6).value || '').trim(),
      loaiBan: String(row.getCell(7).value || '').trim(),
      ghiChu: String(row.getCell(8).value || '').trim()
    });
  }

  console.log(`Verifying ${path.basename(filePath)}: found ${rows.length} rows`);
  if (rows.length !== expectedRows) {
    throw new Error(`Expected ${expectedRows} rows, but found ${rows.length}`);
  }

  let lastEnd = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r.stt !== i + 1) {
      throw new Error(`Row ${i + 1} has invalid stt: ${r.stt}`);
    }

    if (r.ghiChu !== '') {
      throw new Error(`Row ${r.stt} has non-empty ghiChu: "${r.ghiChu}"`);
    }

    const m = r.toSoTrangSo.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) {
      throw new Error(`Row ${r.stt} has invalid toSoTrangSo format: "${r.toSoTrangSo}"`);
    }
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;

    if (start !== lastEnd + 1) {
      throw new Error(`Row ${r.stt} gap/overlap: start=${start}, lastEnd=${lastEnd}`);
    }
    lastEnd = end;
  }

  if (lastEnd !== expectedTotalSheets) {
    throw new Error(`Expected total sheets ${expectedTotalSheets}, but lastEnd=${lastEnd}`);
  }

  console.log(`✓ ${path.basename(filePath)} passed all checks: 1 to ${lastEnd}, ${rows.length} rows.`);
}

async function run() {
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2018_18B.xlsx'), 89, 192);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2018_18B.xlsx'), 89, 192);
  console.log('ALL BATCH 2018-4 CHECKS PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
