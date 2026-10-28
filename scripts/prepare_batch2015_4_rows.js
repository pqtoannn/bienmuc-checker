import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';

function cleanStr(val) {
  if (val === null || val === undefined) return '';
  return val.toString().trim();
}

function parseRange(str) {
  if (!str) return null;
  const cleaned = str.replace(/\s+/g, '');
  const m = cleaned.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const s = parseInt(m[1], 10);
  const e = m[2] ? parseInt(m[2], 10) : s;
  return { start: s, end: e };
}

// Check 15D
function check15D() {
  console.log('\n--- Checking 15D ---');
  const wb = xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15D.xlsx'));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  // row 5 is header (1), row 6 is STT 1 (cover)
  // row 7 (index 6) is STT 2 (scan 002, sheet 01)
  // row 150 (index 149) is STT 145 (scan 145, sheet 296)
  // row 151 (index 150) is STT 146 (scan 146, photo)
  const activeRaw = rows.slice(6, 150); // 144 items
  console.log(`15D active raw items: ${activeRaw.length}`);
  
  // Let's trace sheet starts
  activeRaw.forEach((r, idx) => {
    const pNum = idx + 2;
    const pFile = String(pNum).padStart(3, '0') + '.jpg';
    const so = cleanStr(r[1]);
    const d = cleanStr(r[2]);
    const ty = cleanStr(r[3]).slice(0, 40);
    const rawTo = cleanStr(r[5]);
    // console.log(`${pFile} | STT:${r[0]} | Số:${so} | Ngày:${d} | Tờ:${rawTo}`);
  });
}

// Check 15F
function check15F() {
  console.log('\n--- Checking 15F ---');
  const wb = xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15F.xlsx'));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  // row 5 is header, row 6 (index 5) is STT 1 (scan 002)
  console.log(`Total rows: ${rows.length}`);
  rows.slice(5).forEach((r, idx) => {
    // console.log(`[${idx+1}] STT:${r[0]} | Số:${cleanStr(r[1])} | Tờ:${cleanStr(r[5])}`);
  });
}

// Check 15K
function check15K() {
  console.log('\n--- Checking 15K ---');
  const wb = xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15K.xlsx'));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`Total rows: ${rows.length}`);
}

check15D();
check15F();
check15K();
