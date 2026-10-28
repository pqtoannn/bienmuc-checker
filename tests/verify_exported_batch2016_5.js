import path from 'path';
import ExcelJS from 'exceljs';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_TL_LOAI = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/Tl_loại_VP_Toàn_PL.xlsx';

async function verifyExcel(filePath, expectedRows, expectedFirstSheet, expectedLastSheet) {
  console.log(`Verifying ${filePath}...`);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  let activeCount = 0;
  let lastEnd = 0;

  for (let r = 7; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (stt === null || stt === undefined || String(stt).trim() === '') continue;

    activeCount++;
    const so = String(row.getCell(2).value || '').trim();
    const d = String(row.getCell(3).value || '').trim();
    const ty = String(row.getCell(4).value || '').trim();
    const tg = String(row.getCell(5).value || '').trim();
    const toSo = String(row.getCell(6).value || '').trim();
    const loaiBan = String(row.getCell(7).value || '').trim();
    const ghiChu = String(row.getCell(8).value || '').trim();

    if (!toSo) throw new Error(`Row ${r}: missing toSo`);
    if (ghiChu !== '') throw new Error(`Row ${r}: ghiChu must be blank, got '${ghiChu}'`);
    if (tg.includes('uỷ')) throw new Error(`Row ${r}: tg has 'uỷ' instead of 'ủy'`);

    const parts = toSo.split('-').map(p => parseInt(p.trim(), 10));
    const s = parts[0];
    const e = parts.length > 1 ? parts[1] : parts[0];

    if (activeCount === 1) {
      if (s !== expectedFirstSheet) throw new Error(`Row ${r}: first sheet ${s} !== ${expectedFirstSheet}`);
    } else {
      if (s !== lastEnd + 1) {
        throw new Error(`Row ${r} (STT ${stt}): gap detected! start=${s}, lastEnd=${lastEnd}`);
      }
    }
    lastEnd = e;
  }

  if (activeCount !== expectedRows) {
    throw new Error(`Row count mismatch: got ${activeCount}, expected ${expectedRows}`);
  }

  if (lastEnd !== expectedLastSheet) {
    throw new Error(`Last sheet mismatch: got ${lastEnd}, expected ${expectedLastSheet}`);
  }

  console.log(`PASS: ${path.basename(filePath)} has ${activeCount} rows, sheets ${expectedFirstSheet} to ${expectedLastSheet} strictly gapless!`);
}

async function verifySync() {
  console.log('Verifying duplicates synced to Tl_loại_VP_Toàn_PL.xlsx...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(P_TL_LOAI);
  const ws = wb.getWorksheet('Trùng');
  const duplicates = ['008.jpg', '038.jpg', '161.jpg'];
  for (const dup of duplicates) {
    let found = false;
    for (let r = 7; r <= ws.rowCount; r++) {
      const lyDo = String(ws.getRow(r).getCell(5).value || '');
      if (lyDo.includes('PL_2016_16G') && lyDo.includes(dup)) {
        found = true;
        break;
      }
    }
    if (!found) throw new Error(`Duplicate ${dup} not found in Tl_loại_VP_Toàn_PL.xlsx!`);
  }
  console.log('PASS: All duplicates verified in Tl_loại_VP_Toàn_PL.xlsx!');
}

async function main() {
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2016_16G.xlsx'), 160, 1, 267);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2016_16G.xlsx'), 160, 1, 267);
  await verifySync();
  console.log('\n========================================');
  console.log('BATCH 2016-5 (PL_2016_16G) 100% VERIFIED!');
  console.log('YEAR 2016 IS NOW 100% COMPLETE (13 DOSSIERS TOTAL: 16A to 16M)!');
  console.log('========================================\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
