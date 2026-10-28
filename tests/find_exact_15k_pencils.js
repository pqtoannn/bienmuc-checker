import xlsx from 'xlsx';
import fs from 'fs';

// Let's read raw Excel of 15K
const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(6); // rows[6] is STT 1 (scan 001.jpg)

const activeItems = [];
rawData.forEach((r, idx) => {
  const scanNum = idx + 1;
  const scan = String(scanNum).padStart(3, '0') + '.jpg';
  if (scanNum === 1 || scanNum === 67 || scanNum === 72 || scanNum === 181) return;
  activeItems.push({
    scan,
    scanNum,
    stt: r[0],
    so: r[1] || '',
    rawTo: (r[5] || '').toString().trim()
  });
});

console.log('Total active items:', activeItems.length);

// Let's print scan vs rawTo for all items
activeItems.forEach((item, i) => {
  console.log('[' + (i+1) + '] ' + item.scan + ' | rawTo:' + item.rawTo);
});
