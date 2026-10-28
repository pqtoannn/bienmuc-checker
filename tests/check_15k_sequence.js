import xlsx from 'xlsx';
import path from 'path';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(5);

const filtered = [];
rawData.forEach((r, idx) => {
  const stt = parseInt(r[0], 10);
  if (stt === 67 || stt === 72 || stt === 181) {
    // duplicate
  } else if (!isNaN(stt)) {
    filtered.push({ stt, r });
  }
});

function parseRange(str) {
  if (!str) return null;
  const cleaned = str.replace(/\s+/g, '');
  const m = cleaned.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const s = parseInt(m[1], 10);
  const e = m[2] ? parseInt(m[2], 10) : s;
  return { start: s, end: e };
}

let lastEnd = 0;
filtered.forEach(({ stt, r }, idx) => {
  const rawTo = (r[5] || '').toString().trim();
  const pr = parseRange(rawTo);
  console.log(`[#${idx+1}] STT:${stt} | rawTo:${rawTo} | parsed:${pr ? `${pr.start}-${pr.end}` : 'null'}`);
});
