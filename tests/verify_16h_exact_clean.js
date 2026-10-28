import ExcelJS from 'exceljs';
import fs from 'fs';

function formatRange(start, end) {
  const sStr = String(start).padStart(2, '0');
  if (start === end) return sStr;
  const eStr = String(end).padStart(2, '0');
  return `${sStr}-${eStr}`;
}

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16H.xlsx');
  const ws = wb.worksheets[0];

  const rawRows = [];
  for (let r = 8; r <= 117; r++) {
    const row = ws.getRow(r);
    const img = String(r - 6).padStart(3, '0') + '.jpg';
    rawRows.push({
      r,
      img,
      so: row.getCell(2).text?.trim() || '',
      d: row.getCell(3).text?.trim() || '',
      trich: row.getCell(4).text?.trim() || '',
      tg: row.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc',
      toSo: row.getCell(6).text?.trim() || '',
      loaiBan: row.getCell(7).text?.trim() || 'Bản gốc'
    });
  }

  // Active docs list (skip 017.jpg)
  const activeDocs = rawRows.filter(item => item.img !== '017.jpg');
  console.log(`16H activeDocs length: ${activeDocs.length}`);

  const startsH = [
    1, 4, 5, 8, 11, 12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 
    29, 31, 32, 33, 36, 38, 39, 40, 41, 42, 43, 44, 45, 47, 48, 49, 51, 52, 54, 55, 
    56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 75, 76, 
    77, 84, 85, 86, 87, 91, 92, 93, 94, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 
    110, 111, 112, 113, 114, 115, 118, 119, 121, 122, 123, 124, 125, 126, 127, 129, 130, 131, 132, 133, 
    134, 135, 146, 147, 148, 149, 150, 151, 152
  ];

  console.log(`16H startsH length: ${startsH.length}`);

  let lastEnd = 0;
  let hasGap = false;
  for (let i = 0; i < activeDocs.length; i++) {
    const s = startsH[i];
    const e = (i === activeDocs.length - 1) ? 152 : startsH[i + 1] - 1;
    if (s !== lastEnd + 1) {
      console.error(`GAP at [${i+1}] img: ${activeDocs[i].img}: prevEnd=${lastEnd}, start=${s}`);
      hasGap = true;
    }
    lastEnd = e;
  }
  if (!hasGap && lastEnd === 152 && activeDocs.length === startsH.length) {
    console.log('SUCCESS! 16H 100% GAPLESS CONTINUOUS NUMBERING ACROSS ALL 109 DOCUMENTS FROM 01 TO 152!');
  } else {
    console.error('FAILED verification for 16H!');
  }
}
main();
