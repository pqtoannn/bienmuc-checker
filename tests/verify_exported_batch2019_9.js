import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const OUTPUT_OCR_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const pad = (n) => String(n).padStart(2, '0');

async function verifyDossier(dossier, expectedCount, expectedMaxSheet) {
  console.log(`\n==============================================`);
  console.log(`VERIFYING ${dossier}...`);
  console.log(`==============================================`);

  const file1 = path.join(DA_CHECK_DIR, `${dossier}.xlsx`);
  const file2 = path.join(OUTPUT_OCR_DIR, `${dossier}.xlsx`);
  const jobFile = path.join(OUTPUT_OCR_DIR, `${dossier}.job.json`);

  if (!fs.existsSync(file1)) throw new Error(`Missing ${file1}`);
  if (!fs.existsSync(file2)) throw new Error(`Missing ${file2}`);
  if (!fs.existsSync(jobFile)) throw new Error(`Missing ${jobFile}`);

  const job = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
  console.log(`[Job] Status: ${job.status}, DuAn: ${job.duAnTen}, SoHoSo: ${job.soHoSo}`);
  console.log(`[Job] TieuDe: ${job.data.tieuDeNghiQuyet}, ThoiGian: ${job.data.thoiGianHoSo}`);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file1);
  const ws = wb.worksheets[0];

  const rows = [];
  let lastEnd = 0;
  let activeRows = 0;

  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;

    if (stt && !isNaN(Number(stt))) {
      activeRows++;
      const soHieu = row.getCell(2).text ? row.getCell(2).text.trim() : '';
      const ngay = row.getCell(3).text ? row.getCell(3).text.trim() : '';
      const trichYeu = row.getCell(4).text ? row.getCell(4).text.trim() : '';
      const tacGia = row.getCell(5).text ? row.getCell(5).text.trim() : '';
      const toSo = row.getCell(6).text ? row.getCell(6).text.trim() : '';
      const loaiBan = row.getCell(7).text ? row.getCell(7).text.trim() : '';
      const ghiChu = row.getCell(8).text ? row.getCell(8).text.trim() : '';

      if (ghiChu !== '') {
        throw new Error(`Row ${activeRows} has non-empty ghiChu: '${ghiChu}'`);
      }

      let s, e;
      if (toSo.includes('-')) {
        const parts = toSo.split('-').map(Number);
        s = parts[0];
        e = parts[1];
      } else {
        s = Number(toSo);
        e = Number(toSo);
      }

      if (s !== lastEnd + 1) {
        throw new Error(`GAP ERROR at row ${activeRows} (STT ${stt}): expected start ${lastEnd + 1}, got ${s} (toSo='${toSo}')`);
      }
      lastEnd = e;

      rows.push({ stt, soHieu, ngay, trichYeu, tacGia, toSo, loaiBan });
      if (activeRows <= 3 || activeRows >= expectedCount - 2) {
        console.log(`  Row ${String(activeRows).padStart(2)} | STT: ${String(stt).padEnd(2)} | ToSo: ${toSo.padEnd(7)} | Ngay: ${ngay.padEnd(10)} | TrichYeu: ${trichYeu.slice(0, 45)}`);
      }
    }
  }

  console.log(`[Excel] Active rows: ${rows.length} (Expected: ${expectedCount})`);
  if (rows.length !== expectedCount) {
    throw new Error(`Row count mismatch: expected ${expectedCount}, got ${rows.length}`);
  }

  if (lastEnd !== expectedMaxSheet) {
    throw new Error(`Final sheet mismatch: expected ${expectedMaxSheet}, got ${lastEnd}`);
  }

  console.log(`[PASS] ${dossier}: ${rows.length} active rows, sheets 01-${pad(lastEnd)}, gapless & continuous.`);
}

async function verifyTlLoai() {
  console.log(`\n==============================================`);
  console.log(`VERIFYING Tl_loại_VP_Toàn_PL.xlsx SYNC...`);
  console.log(`==============================================`);

  const tlPath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tlPath);

  const wsPhoto = wb.getWorksheet('Photo');
  let matchCount = 0;
  wsPhoto.eachRow(r => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('129/QĐ-UBND') || val.includes('14/QĐ-UBND') || val.includes('92/QĐ-UBND') || val.includes('Thống kê kết quả đánh giá cán bộ chuyên trách, công chức')) {
      matchCount++;
      console.log(`  [Synced Photo Entry]: ${val.slice(0, 75)}`);
    }
  });

  if (matchCount < 4) {
    throw new Error(`Expected at least 4 synced photo entries for 19S, found ${matchCount}`);
  }
  console.log(`[PASS] Tl_loại_VP_Toàn_PL.xlsx verified with ${matchCount} synced entries.`);
}

async function main() {
  await verifyDossier('PL_2019_19S', 54, 179);
  await verifyDossier('PL_2019_19T', 3, 23);
  await verifyTlLoai();
  console.log('\n==============================================');
  console.log('ALL BATCH 2019-9 VERIFICATIONS PASSED (100%)!');
  console.log('==============================================');
}

main().catch(err => {
  console.error('\n[VERIFICATION FAILED]:', err.message);
  process.exit(1);
});
