import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const rawData = rows.slice(6); // rows[6] is STT 1
console.log('Raw data length:', rawData.length);

const activeRows = [];
rawData.forEach((r, idx) => {
  const scanNum = idx + 1; // idx 0 is scan 1, idx 1 is scan 2, ..., idx 190 is scan 191
  const scanFile = String(scanNum).padStart(3, '0') + '.jpg';
  if (scanNum === 1) return; // skip 001.jpg cover
  if (scanNum === 67) return; // skip duplicate 067.jpg
  if (scanNum === 72) return; // skip duplicate 072.jpg
  if (scanNum === 181) return; // skip duplicate 181.jpg

  activeRows.push({
    scanNum,
    scanFile,
    stt: r[0],
    so: r[1] || '',
    date: r[2] || '',
    trichYeu: r[3] || '',
    tacGia: r[4] || 'Ủy ban nhân dân xã Phú Lộc',
    rawToSo: r[5] || '',
    loaiBan: r[6] || 'Bản gốc'
  });
});

console.log('Active rows count:', activeRows.length);
