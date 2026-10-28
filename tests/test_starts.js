import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';

async function listAllStarts() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16A.xlsx'));
  const ws = wb.worksheets[0];
  
  // Visual findings for 16A (from photo 002 to 045):
  // 002: 01
  // 003: 03
  // 004: 17
  // 005: 21
  // 006: 30 (or 25-30? wait, let's check 006: raw says 70? wait, raw had 21-69, 70, 33-40. Raw was OCR with wild numbers!)
  // Let's verify each photo's visual corner sheet number!
}
