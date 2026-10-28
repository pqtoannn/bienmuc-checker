import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const activeItems = [];
for (let r = 5; r <= 150; r++) {
  const stt = parseInt(rows[r][0], 10);
  if (stt === 1 || stt === 92 || stt === 101 || stt === 146) continue;
  activeItems.push({
    stt,
    scan: String(stt).padStart(3, '0') + '.jpg',
    so: rows[r][1] || '',
    rawTo: (rows[r][5] || '').toString().trim()
  });
}

console.log('Active items:', activeItems.length);

// Let's parse rawTo ranges or single sheets
function parseRawTo(rawTo) {
  if (!rawTo) return null;
  const m = rawTo.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const s = parseInt(m[1], 10);
  const e = m[2] ? parseInt(m[2], 10) : s;
  return { s, e };
}

activeItems.forEach((item, idx) => {
  const pr = parseRawTo(item.rawTo);
  console.log(`[${idx+1}] STT:${item.stt} | raw: "${item.rawTo}" | parsed: ${pr ? `${pr.s}-${pr.e}` : 'null'}`);
});
