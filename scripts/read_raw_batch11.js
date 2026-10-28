import xlsxMod from 'xlsx';
const xlsx = xlsxMod.default || xlsxMod;

for (const d of ['PL_2019_19W', 'PL_2019_19X']) {
  console.log(`\n================== RAW EXCEL: ${d} ==================`);
  const wb = xlsx.readFile(`C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/${d}.xlsx`);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
  for (let r = 0; r < Math.min(data.length, 30); r++) {
    if (data[r] && data[r].length > 0) {
      console.log(`Row ${r}:`, JSON.stringify(data[r]));
    }
  }
  if (data.length > 30) {
    console.log(`... and ${data.length - 30} more rows. Last 5 rows:`);
    for (let r = data.length - 5; r < data.length; r++) {
      if (data[r] && data[r].length > 0) {
        console.log(`Row ${r}:`, JSON.stringify(data[r]));
      }
    }
  }
}
