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

  // Check Trùng sheet
  const wsTrùng = wb.getWorksheet('Trùng');
  if (!wsTrùng) throw new Error("Missing 'Trùng' sheet in Tl_loai!");
  let found15LTrung = false;
  for (let r = 7; r <= wsTrùng.rowCount; r++) {
    const title = String(wsTrùng.getRow(r).getCell(3).value || '');
    if (title.includes('PL_2015_15L') || title.includes('Lầu Say Còong')) {
      found15LTrung = true;
      console.log(`Found 15L duplicate in Tl_loại row ${r}: ${title}`);
      break;
    }
  }
  if (!found15LTrung) throw new Error('Duplicate of PL_2015_15L not found in Tl_loại_VP_Toàn_PL.xlsx (Trùng)!');

  // Check Photo sheet
  const wsPhoto = wb.getWorksheet('Photo');
  if (!wsPhoto) throw new Error("Missing 'Photo' sheet in Tl_loai!");
  let found15LPhoto = 0;
  for (let r = 2; r <= wsPhoto.rowCount; r++) {
    const title = String(wsPhoto.getRow(r).getCell(3).value || '');
    if (title.includes('13/QĐ-UBND') || title.includes('129/BC-TĐKT') || title.includes('186/TB-TĐKT') || title.includes('1824/UBND-TĐKT') || title.includes('chiến sĩ thi đua cơ sở năm 2015')) {
      found15LPhoto++;
    }
  }
  console.log(`Found ${found15LPhoto} photo documents of PL_2015_15L in Tl_loại (Photo)`);
  if (found15LPhoto < 5) throw new Error(`Expected at least 5 photo documents for PL_2015_15L, got ${found15LPhoto}`);

  console.log('PASS: Tl_loại sync verified!');
}

async function main() {
  console.log('--- Verifying Batch 2015-3 ---');
  // 15G: 87 rows, 1 to 225
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2015_15G.xlsx'), 87, 1, 225);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2015_15G.xlsx'), 87, 1, 225);

  // 15I: 94 rows, 1 to 137
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2015_15I.xlsx'), 94, 1, 137);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2015_15I.xlsx'), 94, 1, 137);

  // 15L: 100 rows, 1 to 339
  await verifyExcel(path.join(P_DA_CHECK, 'PL_2015_15L.xlsx'), 100, 1, 339);
  await verifyExcel(path.join(P_OUTPUT_OCR, 'PL_2015_15L.xlsx'), 100, 1, 339);

  // Check sync
  await verifySync();

  console.log('\n======================================================');
  console.log('ALL BATCH 2015-3 DOSSIERS VERIFIED 100% PERFECTLY!');
  console.log('======================================================');
}

main().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
