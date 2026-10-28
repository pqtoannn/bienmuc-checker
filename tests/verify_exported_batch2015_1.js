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
  console.log('Verifying duplicates and photos synced to Tl_loại_VP_Toàn_PL.xlsx...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(P_TL_LOAI);
  
  // Trùng: 014.jpg in PL_2015_15B
  const wsTrung = wb.getWorksheet('Trùng');
  let foundTrung = false;
  for (let r = 7; r <= wsTrung.rowCount; r++) {
    const lyDo = String(wsTrung.getRow(r).getCell(5).value || '');
    if (lyDo.includes('PL_2015_15B') && lyDo.includes('014.jpg')) {
      foundTrung = true;
      break;
    }
  }
  if (!foundTrung) throw new Error('Duplicate 014.jpg of PL_2015_15B not found in Tl_loại_VP_Toàn_PL.xlsx!');

  // Photo: 15M and 15A
  const wsPhoto = wb.getWorksheet('Photo');
  let foundPhoto15M = false;
  let foundPhoto15A = false;
  for (let r = 2; r <= wsPhoto.rowCount; r++) {
    const title = String(wsPhoto.getRow(r).getCell(3).value || '');
    if (title.includes('18/KH-UBND')) foundPhoto15M = true;
    if (title.includes('Phạm Văn Đồng')) foundPhoto15A = true;
  }
  if (!foundPhoto15M) throw new Error('Photo documents of PL_2015_15M not found in Tl_loại_VP_Toàn_PL.xlsx!');
  if (!foundPhoto15A) throw new Error('Photo documents of PL_2015_15A not found in Tl_loại_VP_Toàn_PL.xlsx!');

  console.log('PASS: All duplicates and photos verified in Tl_loại_VP_Toàn_PL.xlsx!');
}

async function main() {
  console.log('--- Verifying Batch 2015-1 ---');
  // 15M: 4 rows, 01-15
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2015_15M.xlsx'), 4, 1, 15);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2015_15M.xlsx'), 4, 1, 15);

  // 15J: 13 rows, 01-33
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2015_15J.xlsx'), 13, 1, 33);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2015_15J.xlsx'), 13, 1, 33);

  // 15B: 14 rows, 01-29
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2015_15B.xlsx'), 14, 1, 29);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2015_15B.xlsx'), 14, 1, 29);

  // 15A: 40 rows, 01-49
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2015_15A.xlsx'), 40, 1, 49);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2015_15A.xlsx'), 40, 1, 49);

  await verifySync();

  console.log('\n========================================');
  console.log('BATCH 2015-1 (15M, 15J, 15B, 15A) 100% VERIFIED!');
  console.log('========================================\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
