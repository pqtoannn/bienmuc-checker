import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(6); // rows[6] is STT 1

// Active STTs: 2 to 191, excluding 67, 72, 181
const activeRows = [];
rawData.forEach((r, idx) => {
  const stt = parseInt(r[0], 10);
  if (stt === 1 || stt === 67 || stt === 72 || stt === 181) return;
  activeRows.push({
    stt,
    scan: String(stt).padStart(3, '0') + '.jpg',
    so: r[1] || '',
    rawTo: (r[5] || '').toString().trim()
  });
});

console.log('Active rows count:', activeRows.length);

// Let's inspect rawTo for all active items
activeRows.forEach((item, i) => {
  console.log(`[${i+1}] STT:${item.stt} (${item.scan}) | rawTo: "${item.rawTo}" | so: ${item.so}`);
});
