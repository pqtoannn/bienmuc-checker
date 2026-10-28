import xlsx from 'xlsx';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const stts = [];
for (let r = 5; r <= 150; r++) {
  const stt = parseInt(rows[r][0], 10);
  stts.push(stt);
}
console.log('Total STTs in raw:', stts.length);
console.log('Min STT:', Math.min(...stts), 'Max STT:', Math.max(...stts));

// Find if any STT is repeated or missing
const counts = {};
stts.forEach(s => counts[s] = (counts[s] || 0) + 1);
const duplicates = Object.keys(counts).filter(s => counts[s] > 1);
console.log('Duplicate STTs:', duplicates);

const missing = [];
for (let s = 1; s <= 146; s++) {
  if (!counts[s]) missing.push(s);
}
console.log('Missing STTs:', missing);
