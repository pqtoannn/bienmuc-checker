import ExcelJS from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/exceljs/dist/es5/index.js';
import path from 'path';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function verifyExcel(fileName, expectedRows, expectedLastSheet) {
  console.log(`\n========================================`);
  console.log(`Verifying ${fileName}...`);
  console.log(`========================================`);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(DA_CHECK_DIR, fileName));
  const ws = wb.getWorksheet(1);

  console.log('Title (Row 2):', ws.getRow(2).getCell(1).value);
  console.log('Dossier title (Row 3):', ws.getRow(3).getCell(1).value);
  console.log('Time range (Row 4):', ws.getRow(4).getCell(1).value);
  console.log('Header box (Row 6):', ws.getRow(6).getCell(1).value);

  let prevEnd = 0;
  let rowCount = 0;
  let gapCount = 0;
  let nonBlankGhiChu = 0;

  for (let r = 9; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const stt = row.getCell(1).value;
    if (!stt) break;
    rowCount++;

    const soKyHieu = row.getCell(2).value || '';
    const ngay = row.getCell(3).value || '';
    const trichYeu = row.getCell(4).value || '';
    const tacGia = row.getCell(5).value || '';
    const toSo = String(row.getCell(6).value || '');
    const loaiBan = row.getCell(7).value || '';
    const ghiChu = row.getCell(8).value || '';

    if (ghiChu !== '') {
      console.warn(`Row ${rowCount} has non-blank ghiChu: "${ghiChu}"`);
      nonBlankGhiChu++;
    }

    const parts = toSo.split('-').map(Number);
    const start = parts[0];
    const end = parts.length > 1 ? parts[1] : parts[0];

    if (prevEnd > 0 && start !== prevEnd + 1) {
      console.error(`GAP DETECTED at STT ${stt}: prevEnd=${prevEnd}, start=${start} (toSo="${toSo}")`);
      gapCount++;
    }
    prevEnd = end;

    if (rowCount === 1 || rowCount === expectedRows) {
      console.log(`Row ${rowCount} [STT ${stt}]: toSo="${toSo}", so="${soKyHieu}", ngay="${ngay}", tacGia="${tacGia}", loaiBan="${loaiBan}"`);
    }
  }

  console.log(`Total rows checked: ${rowCount} (Expected: ${expectedRows})`);
  console.log(`Last sheet reached: ${prevEnd} (Expected: ${expectedLastSheet})`);
  console.log(`Total gaps: ${gapCount}`);
  console.log(`Total non-blank ghiChu: ${nonBlankGhiChu}`);

  if (rowCount === expectedRows && prevEnd === expectedLastSheet && gapCount === 0 && nonBlankGhiChu === 0) {
    console.log(`>>> VERIFICATION PASSED FOR ${fileName}! <<<`);
  } else {
    throw new Error(`Verification failed for ${fileName}`);
  }
}

async function main() {
  await verifyExcel('PL_2021_21U.xlsx', 56, 198);
  await verifyExcel('PL_2021_21V.xlsx', 5, 23);
}

main().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
