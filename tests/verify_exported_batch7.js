import ExcelJS from 'exceljs';
import path from 'path';

const DA_CHECK_DIR = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';

async function verifyExcel(fileName, expectedRows, expectedMaxSheet) {
  console.log(`\n--- VERIFYING ${fileName} ---`);
  const filePath = path.join(DA_CHECK_DIR, fileName);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  const ws = wb.worksheets[0];
  console.log(`Sheet name: ${ws.name}`);

  // Headers check
  const title = ws.getCell('A2').value || ws.getCell('A1').value;
  console.log(`Title: ${title}`);

  // Data rows start at row 9
  let rowIdx = 9;
  let activeRows = 0;
  let prevEnd = 0;
  let gapCount = 0;
  let nonBlankGhiChu = 0;

  while (true) {
    const row = ws.getRow(rowIdx);
    const stt = row.getCell(1).value;
    if (!stt) break;

    activeRows++;
    const soHieu = row.getCell(2).value;
    const ngay = row.getCell(3).value;
    const toSo = (row.getCell(6).value || '').toString().trim();
    const ghiChu = (row.getCell(8).value || '').toString().trim();

    if (ghiChu !== '') {
      nonBlankGhiChu++;
      console.log(`Row ${rowIdx} STT ${stt} has non-blank ghiChu: "${ghiChu}"`);
    }

    // Check sheet continuous
    let s = 0, e = 0;
    if (toSo.includes('-')) {
      const parts = toSo.split('-');
      s = parseInt(parts[0], 10);
      e = parseInt(parts[1], 10);
    } else {
      s = parseInt(toSo, 10);
      e = s;
    }

    if (activeRows === 1) {
      if (s !== 1) {
        console.log(`Error: First doc starts at sheet ${s} instead of 1!`);
        gapCount++;
      }
    } else {
      if (s !== prevEnd + 1) {
        console.log(`Gap/overlap at row ${rowIdx} STT ${stt}: prevEnd=${prevEnd}, s=${s}`);
        gapCount++;
      }
    }
    prevEnd = e;
    rowIdx++;
  }

  console.log(`Total active rows: ${activeRows} (expected: ${expectedRows})`);
  console.log(`Final sheet: ${prevEnd} (expected: ${expectedMaxSheet})`);
  console.log(`Gap count: ${gapCount}`);
  console.log(`Non-blank ghiChu count: ${nonBlankGhiChu}`);

  if (activeRows === expectedRows && prevEnd === expectedMaxSheet && gapCount === 0 && nonBlankGhiChu === 0) {
    console.log(`>>> ${fileName} PASSES 100% VALIDATION!`);
  } else {
    console.log(`>>> ${fileName} HAS VALIDATION ERRORS!`);
  }
}

async function verifyTlLoai() {
  console.log(`\n--- VERIFYING Tl_loại_VP_Toàn_PL.xlsx ---`);
  const filePath = path.join(DA_CHECK_DIR, 'Tl_loại_VP_Toàn_PL.xlsx');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  const wsPhoto = wb.getWorksheet('Photo');
  let photoMatch = false;
  wsPhoto.eachRow((r, rowNum) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('552/QĐ-UBND') && val.includes('Võ Thị Vang')) {
      photoMatch = true;
      console.log(`Photo sheet row ${rowNum}: ${val.slice(0, 70)}...`);
    }
  });

  const wsTrung = wb.getWorksheet('Trùng');
  let trungMatch = false;
  wsTrung.eachRow((r, rowNum) => {
    const val = (r.getCell(3).value || '').toString();
    if (val.includes('484/QĐ-UBND') && val.includes('Đường Ông Ba Lộc')) {
      trungMatch = true;
      console.log(`Trùng sheet row ${rowNum}: ${val.slice(0, 70)}...`);
    }
  });

  console.log(`Photo 21p present: ${photoMatch}`);
  console.log(`Trùng 21p present: ${trungMatch}`);
}

async function main() {
  await verifyExcel('PL_2021_21o.xlsx', 207, 215);
  await verifyExcel('PL_2021_21p.xlsx', 196, 224);
  await verifyTlLoai();
}

main().catch(console.error);
