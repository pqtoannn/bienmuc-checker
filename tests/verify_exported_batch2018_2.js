import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

async function verifyDossier(dosId, expectedRowsCount, expectedLastSheet) {
  for (const dir of [P_DA_CHECK, P_OUTPUT_OCR]) {
    const file = path.join(dir, `${dosId}.xlsx`);
    if (!fs.existsSync(file)) {
      throw new Error(`File does not exist: ${file}`);
    }

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(file);
    const ws = wb.worksheets[0];

    const dataRows = [];
    let startData = false;

    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const c1 = String(row.getCell(1).value || '').trim();
      const c2 = String(row.getCell(2).value || '').trim();

      if (c1 === 'STT' || c1 === '(1)' || c2.includes('Số, ký hiệu')) {
        startData = true;
        continue;
      }

      if (startData && c1 && /^\d+$/.test(c1)) {
        dataRows.push({
          rowIdx: r,
          stt: parseInt(c1, 10),
          soKyHieu: String(row.getCell(2).value || '').trim(),
          ngayThang: String(row.getCell(3).value || '').trim(),
          trichYeu: String(row.getCell(4).value || '').trim(),
          tacGia: String(row.getCell(5).value || '').trim(),
          toSo: String(row.getCell(6).value || '').trim(),
          loaiBan: String(row.getCell(7).value || '').trim(),
          ghiChu: String(row.getCell(8).value || '').trim()
        });
      }
    }

    console.log(`[${dosId}] in ${dir}: Found ${dataRows.length} active rows`);
    if (dataRows.length !== expectedRowsCount) {
      throw new Error(`Row count mismatch for ${dosId} in ${dir}: expected ${expectedRowsCount}, got ${dataRows.length}`);
    }

    let lastEnd = 0;
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (row.stt !== i + 1) {
        throw new Error(`STT sequence error at row ${i + 1}: expected ${i + 1}, got ${row.stt}`);
      }

      if (row.ghiChu !== '') {
        throw new Error(`Row ${row.stt} has non-empty ghiChu: '${row.ghiChu}'`);
      }

      const toSo = row.toSo;
      let startSheet = 0;
      let endSheet = 0;

      if (toSo.includes('-')) {
        const parts = toSo.split('-').map(p => parseInt(p.trim(), 10));
        startSheet = parts[0];
        endSheet = parts[1];
      } else {
        startSheet = parseInt(toSo, 10);
        endSheet = startSheet;
      }

      if (startSheet !== lastEnd + 1) {
        throw new Error(`Continuity gap at row ${row.stt}: expected start ${lastEnd + 1}, got ${startSheet} (toSo: '${toSo}')`);
      }
      if (endSheet < startSheet) {
        throw new Error(`Invalid sheet range at row ${row.stt}: '${toSo}'`);
      }
      lastEnd = endSheet;
    }

    if (lastEnd !== expectedLastSheet) {
      throw new Error(`Final sheet mismatch for ${dosId}: expected ${expectedLastSheet}, got ${lastEnd}`);
    }

    console.log(`[${dosId}] in ${dir}: VERIFIED PERFECT! Continuous sheets 01 to ${lastEnd}, all ghiChu blank.`);
  }
}

async function main() {
  await verifyDossier('PL_2018_18N', 14, 41);
  await verifyDossier('PL_2018_18K', 14, 49);
  await verifyDossier('PL_2018_18I', 21, 42);
  console.log('ALL Batch 2018-2 dossiers verified successfully and strictly compliant!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
