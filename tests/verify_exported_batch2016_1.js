import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

const dossiers = [
  { id: 'PL_2016_16C', expectedRows: 3, expectedFinalSheet: 6 },
  { id: 'PL_2016_16M', expectedRows: 6, expectedFinalSheet: 12 },
  { id: 'PL_2016_16L', expectedRows: 10, expectedFinalSheet: 14 },
  { id: 'PL_2016_16A', expectedRows: 44, expectedFinalSheet: 161 }
];

async function verifyExcel(filePath, expected) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const dataRows = [];
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).text?.trim();
    const ty = row.getCell(4).text?.trim();
    if (!stt || isNaN(Number(stt))) continue;
    if (stt === 'STT' || stt.includes('(') || ty === 'Tên loại và trích yếu nội dung văn bản') continue;
    dataRows.push({
      rowIdx: r,
      stt: Number(stt),
      so: row.getCell(2).text?.trim(),
      d: row.getCell(3).text?.trim(),
      ty: ty,
      tg: row.getCell(5).text?.trim(),
      toSo: row.getCell(6).text?.trim(),
      loaiBan: row.getCell(7).text?.trim(),
      ghiChu: row.getCell(8).text?.trim()
    });
  }

  if (dataRows.length !== expected.expectedRows) {
    throw new Error(`Row count mismatch in ${path.basename(filePath)}: got ${dataRows.length}, expected ${expected.expectedRows}`);
  }

  let lastEnd = 0;
  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    if (r.stt !== i + 1) {
      throw new Error(`STT sequence error at row ${i + 1}: got ${r.stt}`);
    }

    // Check toSo continuous
    let s, e;
    if (r.toSo.includes('-')) {
      const parts = r.toSo.split('-').map(x => parseInt(x.trim(), 10));
      s = parts[0];
      e = parts[1];
    } else {
      s = parseInt(r.toSo.trim(), 10);
      e = s;
    }

    if (s !== lastEnd + 1) {
      throw new Error(`Gap in sheet numbering at doc ${i + 1} (${r.toSo}): expected start ${lastEnd + 1}, got ${s}`);
    }
    lastEnd = e;

    if (r.ghiChu !== '') {
      throw new Error(`ghiChu is not empty at doc ${i + 1}: "${r.ghiChu}"`);
    }
  }

  if (lastEnd !== expected.expectedFinalSheet) {
    throw new Error(`Final sheet mismatch in ${path.basename(filePath)}: got ${lastEnd}, expected ${expected.expectedFinalSheet}`);
  }

  console.log(`[PASS] ${path.basename(filePath)}: ${dataRows.length} rows, sheets 01-${lastEnd}`);
}

async function verifyAll() {
  console.log('Verifying Batch 2016-1 exports...');
  for (const dos of dossiers) {
    await verifyExcel(path.join(P_DA_CHECK, `${dos.id}.xlsx`), dos);
    await verifyExcel(path.join(P_OUTPUT_OCR, `${dos.id}.xlsx`), dos);
  }
  console.log('ALL BATCH 2016-1 DOSSIERS VERIFIED 100% PERFECT!');
}

verifyAll().catch(err => {
  console.error(err);
  process.exit(1);
});
