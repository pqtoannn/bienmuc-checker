import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15F.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const code = fs.readFileSync('scripts/update_and_export_batch2015_4.js', 'utf8');
const match = code.match(/const starts15F = \[([\s\S]*?)\];/);
const starts15F = match[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

console.log('starts15F length:', starts15F.length);

// Active items: rows 6 to 148, plus row 152
const activeItems = [];
for (let r = 6; r <= 148; r++) {
  activeItems.push({ rowIdx: r, stt: rows[r][0], so: rows[r][1], rawTo: rows[r][5] });
}
activeItems.push({ rowIdx: 152, stt: rows[152][0], so: rows[152][1], rawTo: rows[152][5] });

console.log('Active items length:', activeItems.length);

activeItems.forEach((item, i) => {
  const s = starts15F[i];
  const e = starts15F[i + 1] - 1;
  const sStr = String(s).padStart(2, '0');
  const eStr = String(e).padStart(2, '0');
  const range = s === e ? sStr : sStr + '-' + eStr;
  const raw = (item.rawTo || '').toString().trim();
  const flag = raw !== range ? '*** DIFF' : '';
  if (flag || i < 5 || i > 138) {
    console.log('[' + (i+1) + '] STT:' + item.stt + ' | so:' + item.so + ' | calc:' + range + ' | raw:' + raw + ' ' + flag);
  }
});
