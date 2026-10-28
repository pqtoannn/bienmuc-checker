import ExcelJS from 'exceljs';

async function check15ASequence() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15A.xlsx');
  const ws = wb.worksheets[0];

  const skipIndices = [1, 12, 14, 17, 35, 39]; // 1-based STT in raw Excel
  const activeRows = [];

  for (let r = 6; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (stt === null || stt === undefined || String(stt).trim() === '') continue;
    const sttNum = parseInt(String(stt).trim(), 10);
    const img = String(sttNum).padStart(3, '0') + '.jpg';
    if (skipIndices.includes(sttNum)) {
      console.log(`SKIP: [${sttNum}] ${img} - ${String(row.getCell(4).value||'').slice(0, 30)}`);
      continue;
    }

    activeRows.push({
      stt: sttNum,
      img,
      so: String(row.getCell(2).value || '').trim(),
      d: String(row.getCell(3).value || '').trim(),
      ty: String(row.getCell(4).value || '').trim(),
      tg: String(row.getCell(5).value || '').trim() || 'Ủy ban nhân dân xã Phú Lộc',
      toSo: String(row.getCell(6).value || '').trim(),
      loaiBan: String(row.getCell(7).value || '').trim() || 'Bản gốc'
    });
  }

  console.log(`\nActive rows count: ${activeRows.length}`);
  for (let i = 0; i < activeRows.length; i++) {
    const r = activeRows[i];
    console.log(`[${i+1}] stt=${r.stt} | ${r.img} | toSo: ${r.toSo.padEnd(8)} | so: ${r.so.padEnd(14)} | d: ${r.d.padEnd(11)} | ${r.ty.slice(0, 35)}`);
  }
}
check15ASequence();
