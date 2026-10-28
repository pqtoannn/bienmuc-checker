import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';

function inspectFile(fileName, dosId) {
  console.log(`\n========================================\nAnalyzing ${dosId} (${fileName})...`);
  const wb = xlsx.readFile(path.join(P_RAW_EXCEL, fileName));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  // Find where data starts
  let dataStartIdx = 0;
  for (let i = 0; i < 10; i++) {
    if (rows[i] && (rows[i][0] === '1' || rows[i][0] === 1 || (rows[i][5] && rows[i][5].toString().includes('01')))) {
      dataStartIdx = i;
      break;
    }
  }

  const dataRows = rows.slice(dataStartIdx);
  console.log(`Data starts at row index ${dataStartIdx}, total data rows: ${dataRows.length}`);

  let lastEnd = 0;
  dataRows.forEach((r, idx) => {
    const stt = r[0];
    const so = r[1] || '';
    const date = r[2] || '';
    const trichYeu = (r[3] || '').toString().slice(0, 50);
    const toSo = (r[5] || '').toString().trim();
    const loaiBan = r[6] || '';
    const ghiChu = r[7] || '';

    console.log(`[${idx + 1}] STT:${stt} | Số:${so} | Ngày:${date} | Tờ:${toSo} | LB:${loaiBan} | TY:${trichYeu}`);
  });
}

inspectFile('PL_2015_15D.xlsx', 'PL_2015_15D');
inspectFile('PL_2015_15F.xlsx', 'PL_2015_15F');
inspectFile('PL_2015_15K.xlsx', 'PL_2015_15K');
