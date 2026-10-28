import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

const expectedBatches = [
  { dosId: 'PL_2017_17S', rows: 60, totalSheets: 234 },
  { dosId: 'PL_2017_17X', rows: 62, totalSheets: 219 }
];

async function verifyDossier(item) {
  const { dosId, rows, totalSheets } = item;
  console.log(`Verifying ${dosId}...`);

  const fileOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  const fileDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);

  if (!fs.existsSync(fileOcr)) throw new Error(`Missing ${fileOcr}`);
  if (!fs.existsSync(fileDaCheck)) throw new Error(`Missing ${fileDaCheck}`);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(fileDaCheck);
  const ws = wb.worksheets[0];

  let headerRow = -1;
  ws.eachRow((row, rowNumber) => {
    const val = String(row.getCell(1).value || '').trim();
    if (val === '1' && headerRow === -1) {
      headerRow = rowNumber;
    }
  });

  if (headerRow === -1) throw new Error(`Could not find header row for ${dosId}`);

  let lastEnd = 0;
  let count = 0;

  for (let r = headerRow; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (!stt) break;

    const soKyHieu = String(row.getCell(2).value || '').trim();
    const ngayThang = String(row.getCell(3).value || '').trim();
    const trichYeu = String(row.getCell(4).value || '').trim();
    const tacGia = String(row.getCell(5).value || '').trim();
    const toSo = String(row.getCell(6).value || '').trim();
    const loaiBan = String(row.getCell(7).value || '').trim();
    const ghiChu = String(row.getCell(8).value || '').trim();

    count++;

    const parts = toSo.split('-').map(s => parseInt(s.trim(), 10));
    const startS = parts[0];
    const endS = parts.length > 1 ? parts[1] : parts[0];

    if (isNaN(startS) || isNaN(endS)) {
      throw new Error(`Row ${count} (STT ${stt}): Invalid toSo '${toSo}'`);
    }

    if (startS !== lastEnd + 1) {
      throw new Error(`Row ${count} (STT ${stt}): Gap detected! Expected start ${lastEnd + 1}, got ${startS}`);
    }

    if (endS < startS) {
      throw new Error(`Row ${count} (STT ${stt}): endS < startS in '${toSo}'`);
    }

    lastEnd = endS;

    if (!loaiBan) {
      throw new Error(`Row ${count} (STT ${stt}): loaiBan is empty`);
    }

    if (ghiChu !== '') {
      throw new Error(`Row ${count} (STT ${stt}): ghiChu is '${ghiChu}', expected empty`);
    }
  }

  console.log(`  Count: ${count}/${rows}, Sheets: ${lastEnd}/${totalSheets}`);

  if (count !== rows) {
    throw new Error(`Expected ${rows} rows, got ${count}`);
  }

  if (lastEnd !== totalSheets) {
    throw new Error(`Expected ${totalSheets} sheets, got ${lastEnd}`);
  }

  console.log(`  PASSED for ${dosId}!`);
}

async function verifyAll() {
  for (const item of expectedBatches) {
    await verifyDossier(item);
  }
  console.log('\nALL 2 DOSSIERS OF BATCH 2017-3 PASSED VERIFICATION!');
}

verifyAll().catch(err => {
  console.error('Verification FAILED:', err);
  process.exit(1);
});
