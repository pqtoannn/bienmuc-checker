import ExcelJS from 'exceljs';
import fs from 'fs';

async function check15HSequence() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15H.xlsx');
  const ws = wb.worksheets[0];

  // Scans: 001 to 066
  // 001 is cover (skipped)
  // 043 is duplicate of 042 (skipped)
  const activeScans = [];
  for (let r = 7; r <= 71; r++) {
    const row = ws.getRow(r);
    const stt = parseInt(String(row.getCell(1).value || '').trim(), 10);
    const img = String(stt).padStart(3, '0') + '.jpg';
    if (stt === 1) continue; // 001.jpg cover
    if (stt === 43) {
      console.log(`SKIP DUPLICATE: [${stt}] ${img} (duplicate of 042.jpg)`);
      continue;
    }
    activeScans.push({
      r,
      stt,
      img,
      so: String(row.getCell(2).value || '').trim(),
      d: String(row.getCell(3).value || '').trim(),
      ty: String(row.getCell(4).value || '').trim(),
      tg: String(row.getCell(5).value || '').trim() || 'Ủy ban nhân dân xã Phú Lộc',
      toSo: String(row.getCell(6).value || '').trim(),
      loaiBan: String(row.getCell(7).value || '').trim() || 'Bản gốc'
    });
  }

  console.log(`Active scans count: ${activeScans.length}`);
  fs.writeFileSync('tests/inspect_batch2015_2/15H/active_rows.json', JSON.stringify(activeScans, null, 2));
}
check15HSequence();
