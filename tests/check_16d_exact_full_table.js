import ExcelJS from 'exceljs';
import fs from 'fs';

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2016_16D.xlsx');
  const ws = wb.worksheets[0];

  // Starts from 002.jpg (doc 1) to 133.jpg (doc 128)
  const startsD = [
    // 002 to 021 (20 docs)
    1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18, 25, 26, 27, 28, 33, 34,
    // 022 to 041 (20 docs)
    37, 40, 41, 45, 50, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70,
    // 042 to 061 (20 docs)
    72, 73, 74, 75, 76, 80, 83, 84, 85, 86, 87, 89, 90, 91, 92, 96, 97, 98, 99, 101,
    // 062 to 082 (21 docs): 062 to 068 (102..109), 069 (110), 070 (111), 071 (114), 072 (118), 073 (121), 074 (122), 075 (123), 076 (125), 077 (126), 078 (128), 079 (129), 080 (130), 081 (131)
    // Wait, let's verify docs between 062 and 082!
  ];
}
