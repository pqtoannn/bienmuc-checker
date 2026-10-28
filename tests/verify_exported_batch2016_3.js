import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_TL_LOAI = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/Tl_loại_VP_Toàn_PL.xlsx';

const dossiers = [
  { id: 'PL_2016_16E', expectedRows: 72, expectedEndSheet: 201 },
  { id: 'PL_2016_16B', expectedRows: 78, expectedEndSheet: 206 },
  { id: 'PL_2016_16K', expectedRows: 91, expectedEndSheet: 354 }
];

async function verifyDossier(dos) {
  console.log(`\n--- Verifying ${dos.id} ---`);
  const paths = [
    path.join(P_OUTPUT_OCR, `${dos.id}.xlsx`),
    path.join(P_DA_CHECK, `${dos.id}.xlsx`)
  ];

  for (const p of paths) {
    if (!fs.existsSync(p)) {
      throw new Error(`File does not exist: ${p}`);
    }
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(p);
    const ws = wb.worksheets[0];

    let lastEnd = 0;
    let activeRowCount = 0;

    for (let r = 7; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const stt = row.getCell(1).text?.trim();
      if (!stt) continue;

      activeRowCount++;
      if (parseInt(stt, 10) !== activeRowCount) {
        throw new Error(`Invalid STT at row ${r}: expected ${activeRowCount}, got ${stt} in ${p}`);
      }

      const toSo = row.getCell(6).text?.trim();
      if (!toSo) {
        throw new Error(`Empty toSoTrangSo at row ${r} in ${p}`);
      }

      let start, end;
      if (toSo.includes('-')) {
        const parts = toSo.split('-');
        start = parseInt(parts[0], 10);
        end = parseInt(parts[1], 10);
      } else {
        start = parseInt(toSo, 10);
        end = start;
      }

      if (start !== lastEnd + 1) {
        throw new Error(`Page numbering gap/overlap at row ${r}: lastEnd=${lastEnd}, start=${start} (range: ${toSo}) in ${p}`);
      }
      lastEnd = end;

      const ghiChu = row.getCell(8).text?.trim();
      if (ghiChu && ghiChu !== '') {
        throw new Error(`Ghi chu is not empty at row ${r}: "${ghiChu}" in ${p}`);
      }
    }

    if (activeRowCount !== dos.expectedRows) {
      throw new Error(`Row count mismatch in ${p}: expected ${dos.expectedRows}, got ${activeRowCount}`);
    }
    if (lastEnd !== dos.expectedEndSheet) {
      throw new Error(`Final sheet mismatch in ${p}: expected ${dos.expectedEndSheet}, got ${lastEnd}`);
    }

    console.log(`[PASS] ${p}: ${activeRowCount} rows, sheets 01 to ${lastEnd}`);
  }
}

async function verifyTlLoai() {
  console.log(`\n--- Verifying Tl_loại_VP_Toàn_PL.xlsx ---`);
  if (!fs.existsSync(P_TL_LOAI)) {
    throw new Error(`File does not exist: ${P_TL_LOAI}`);
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(P_TL_LOAI);
  const ws = wb.worksheets[0];
  console.log(`Total rows in Tl_loại: ${ws.rowCount}`);

  const has16B = [];
  const has16K = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const txt = [1,2,3,4,5,6,7].map(c => row.getCell(c).text).join(' ');
    if (txt.includes('PL_2016_16B')) has16B.push(txt);
    if (txt.includes('PL_2016_16K')) has16K.push(txt);
  }
  console.log(`Found ${has16B.length} entries for PL_2016_16B`);
  console.log(`Found ${has16K.length} entries for PL_2016_16K`);
  if (has16B.length === 0 || has16K.length === 0) {
    throw new Error('Missing synced entries in Tl_loại_VP_Toàn_PL.xlsx');
  }
  console.log('[PASS] Synced entries verified in Tl_loại_VP_Toàn_PL.xlsx');
}

async function run() {
  for (const dos of dossiers) {
    await verifyDossier(dos);
  }
  await verifyTlLoai();
  console.log('\n========================================');
  console.log('ALL VERIFICATIONS PASSED FOR BATCH 2016-3!');
  console.log('========================================\n');
}

run().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
