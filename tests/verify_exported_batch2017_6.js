import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

const dossiers = [
  { id: 'PL_2017_17E', expectedRows: 107, expectedSheets: 177 },
  { id: 'PL_2017_17O', expectedRows: 118, expectedSheets: 139 }
];

async function verifyExcel(filePath, dos) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  let activeCount = 0;
  let lastEnd = 0;

  for (let i = 5; i <= ws.rowCount; i++) {
    const r = ws.getRow(i);
    const stt = String(r.getCell(1).value || '').trim();
    const trichYeu = String(r.getCell(4).value || '').trim();
    const toSo = String(r.getCell(6).value || '').trim();
    const ghiChu = String(r.getCell(8).value || '').trim();

    if (!stt || stt === 'STT' || stt.includes('(') || !trichYeu || trichYeu === 'Tên loại và trích yếu nội dung văn bản') continue;

    activeCount++;

    if (ghiChu !== '') {
      throw new Error(`Row ${activeCount} has non-empty ghiChu: "${ghiChu}"`);
    }

    let start, end;
    if (toSo.includes('-')) {
      const parts = toSo.split('-').map(x => parseInt(x.trim(), 10));
      start = parts[0];
      end = parts[1];
    } else {
      start = parseInt(toSo, 10);
      end = start;
    }

    if (isNaN(start) || isNaN(end)) {
      throw new Error(`Row ${activeCount} invalid toSo: "${toSo}"`);
    }

    if (activeCount === 1) {
      if (start !== 1) {
        throw new Error(`First row does not start at 1: got ${start}`);
      }
    } else {
      if (start !== lastEnd + 1) {
        throw new Error(`Gap/overlap at row ${activeCount}: expected ${lastEnd + 1}, got ${start} (toSo: "${toSo}")`);
      }
    }
    lastEnd = end;
  }

  if (activeCount !== dos.expectedRows) {
    throw new Error(`Expected ${dos.expectedRows} rows, got ${activeCount}`);
  }

  if (lastEnd !== dos.expectedSheets) {
    throw new Error(`Expected final sheet ${dos.expectedSheets}, got ${lastEnd}`);
  }

  console.log(`Verified ${path.basename(filePath)}: ${activeCount} rows, sheets 01 to ${lastEnd} [OK]`);
}

async function run() {
  console.log('Verifying Batch 2017-6 exports...');
  for (const dos of dossiers) {
    await verifyExcel(path.join(P_OUTPUT_OCR, `${dos.id}.xlsx`), dos);
    await verifyExcel(path.join(P_DA_CHECK, `${dos.id}.xlsx`), dos);
  }
  console.log('ALL Batch 2017-6 EXPORTS FULLY VERIFIED AND VALID!');
}

run().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
