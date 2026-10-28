import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(5);

const filtered = [];
rawData.forEach((r, idx) => {
  const stt = parseInt(r[0], 10);
  if (stt === 67 || stt === 72 || stt === 181) {
    // duplicate scan
  } else if (!isNaN(stt)) {
    const scanNum = idx + 1; // rawData starts with STT 1 at row 5 (scan 001? Wait! Let's check which scan corresponds to STT 1!)
    filtered.push({ stt, scanNum, r });
  }
});

console.log('Filtered 15K count:', filtered.length);

const code = fs.readFileSync('scripts/update_and_export_batch2015_4.js', 'utf8');
const match = code.match(/const starts15K = \[([\s\S]*?)\];/);
const starts15K = match[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
console.log('starts15K count:', starts15K.length);

// Compare raw sheets with starts15K
for (let i = 0; i < Math.min(filtered.length, starts15K.length - 1); i++) {
  const item = filtered[i];
  const s = starts15K[i];
  const e = starts15K[i + 1] - 1;
  const raw = (item.r[5] || '').toString().trim();
  const calc = s === e ? String(s) : s + '-' + e;
  if (Math.abs(s - parseInt(raw, 10)) > 5 && raw !== '') {
    console.log('[' + (i+1) + '] STT:' + item.stt + ' | calc:' + calc + ' | raw:' + raw);
  }
}
