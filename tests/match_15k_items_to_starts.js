import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(6);

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

// Let's trace each active item from STT 2 to 191
// Notice:
// STT 2: 1-6 (starts 1)
// STT 3: 7 (starts 2? Wait! STT 3 is raw 7, but scan 003 pencil is 02!)
// Let's check what scan 002, 003, 004 have!
