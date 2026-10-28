import xlsx from 'xlsx';
import path from 'path';

const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';
const wb15D = xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2015_15D.xlsx'));
const data15D = xlsx.utils.sheet_to_json(wb15D.Sheets[wb15D.SheetNames[0]], { header: 1 }).slice(6, 150);

console.log('15D data items:', data15D.length);
data15D.forEach((r, idx) => {
  const p = String(idx + 2).padStart(3, '0') + '.jpg';
  console.log(`[${idx+1}] ${p} | ${r[1]} | ${r[2]} | rawTo: ${r[5]}`);
});
