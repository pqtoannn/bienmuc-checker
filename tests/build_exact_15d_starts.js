import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const active15D = [];
for (let r = 5; r <= 150; r++) {
  const row = rows[r];
  const stt = parseInt(row[0], 10);
  if (stt === 1) continue; // 001 cover
  if (stt === 92) continue; // duplicate of 91
  if (stt === 101) continue; // duplicate of 102
  if (stt === 146) continue; // photo
  active15D.push({
    stt,
    scan: String(stt).padStart(3, '0') + '.jpg',
    so: row[1] || '',
    rawTo: (row[5] || '').toString().trim(),
    row
  });
}

console.log('Active 15D count:', active15D.length);

// Let's print each active item and its rawTo
active15D.forEach((a, i) => {
  console.log(`[${i+1}] STT:${a.stt} (${a.scan}) | rawTo: "${a.rawTo}" | so: ${a.so}`);
});
