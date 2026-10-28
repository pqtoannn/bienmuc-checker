import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_TL_LOAI = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/Tl_loại_VP_Toàn_PL.xlsx';

function parseRange(str) {
  if (!str) return null;
  const cleaned = str.toString().trim().replace(/\s+/g, '');
  const m = cleaned.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const s = parseInt(m[1], 10);
  const e = m[2] ? parseInt(m[2], 10) : s;
  return { start: s, end: e };
}

function verifyDossier(dosId, expectedRows, expectedEndSheet) {
  console.log(`\nVerifying ${dosId}...`);
  const fOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  const fDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);

  if (!fs.existsSync(fOcr)) throw new Error(`Missing ${fOcr}`);
  if (!fs.existsSync(fDaCheck)) throw new Error(`Missing ${fDaCheck}`);

  const wb = xlsx.readFile(fDaCheck);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Find where data starts (first row where r[0] is '1' or 1)
  let dataStartIdx = 5;
  for (let i = 4; i < 10; i++) {
    if (rows[i] && (rows[i][0] === '1' || rows[i][0] === 1)) {
      dataStartIdx = i;
      break;
    }
  }
  const dataRows = rows.slice(dataStartIdx);
  console.log(`- Total data rows: ${dataRows.length} (expected: ${expectedRows})`);
  if (dataRows.length !== expectedRows) {
    throw new Error(`${dosId}: expected ${expectedRows} rows, got ${dataRows.length}`);
  }

  let lastEnd = 0;
  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    const stt = parseInt(r[0], 10);
    if (stt !== i + 1) {
      throw new Error(`${dosId} #${i+1}: STT mismatch ${stt} !== ${i+1}`);
    }

    const toSo = (r[5] || '').toString().trim();
    const pr = parseRange(toSo);
    if (!pr) {
      throw new Error(`${dosId} #${i+1}: invalid toSo: "${toSo}"`);
    }

    if (i === 0 && pr.start !== 1) {
      throw new Error(`${dosId} #${i+1}: first document must start at sheet 1, got ${pr.start}`);
    }

    if (i > 0 && pr.start !== lastEnd + 1) {
      throw new Error(`${dosId} #${i+1}: gap detected! ${pr.start} !== ${lastEnd + 1}`);
    }

    if (pr.end < pr.start) {
      throw new Error(`${dosId} #${i+1}: inverted range ${pr.start}-${pr.end}`);
    }

    const ghiChu = (r[7] || '').toString().trim();
    if (ghiChu !== '') {
      throw new Error(`${dosId} #${i+1}: ghiChu must be blank, got "${ghiChu}"`);
    }

    lastEnd = pr.end;
  }

  console.log(`- Final sheet: ${lastEnd} (expected: ${expectedEndSheet})`);
  if (lastEnd !== expectedEndSheet) {
    throw new Error(`${dosId}: expected final sheet ${expectedEndSheet}, got ${lastEnd}`);
  }

  console.log(`=> ${dosId} PASSED ALL TESTS: 100% gapless continuous 01 to ${expectedEndSheet}!`);
}

function verifyTlLoai() {
  console.log('\nVerifying Tl_loại_VP_Toàn_PL.xlsx...');
  const wb = xlsx.readFile(P_TL_LOAI);
  const sheetNames = wb.SheetNames;
  console.log('Sheet names in Tl_loai:', sheetNames);

  const allRows = [];
  sheetNames.forEach(sName => {
    const s = wb.Sheets[sName];
    const data = xlsx.utils.sheet_to_json(s, { header: 1 });
    data.forEach(r => {
      if (r && r.length > 0) {
        allRows.push({ sheet: sName, str: JSON.stringify(r) });
      }
    });
  });

  const dos15D = allRows.filter(e => e.str.includes('15D'));
  const dos15F = allRows.filter(e => e.str.includes('15F'));
  const dos15K = allRows.filter(e => e.str.includes('15K'));

  console.log(`- PL_2015_15D synced: ${dos15D.length} items (3 trùng, 1 photo)`);
  console.log(`- PL_2015_15F synced: ${dos15F.length} items (3 trùng)`);
  console.log(`- PL_2015_15K synced: ${dos15K.length} items (3 trùng, 2 photo)`);

  if (dos15D.length !== 4) throw new Error(`15D expected 4 items, got ${dos15D.length}`);
  if (dos15F.length !== 3) throw new Error(`15F expected 3 items, got ${dos15F.length}`);
  if (dos15K.length !== 5) throw new Error(`15K expected 5 items, got ${dos15K.length}`);

  console.log('=> Tl_loại sync verified successfully: ALL 12 duplicate and photo items present!');
}

function run() {
  verifyDossier('PL_2015_15D', 141, 296);
  verifyDossier('PL_2015_15F', 144, 258);
  verifyDossier('PL_2015_15K', 187, 353);
  verifyTlLoai();
  console.log('\n========================================');
  console.log('ALL VERIFICATIONS FOR BATCH 2015-4 PASSED!');
  console.log('========================================');
}

run();
