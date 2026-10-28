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

    // Check sheet continuous (can have sub-letter like 14a, 14b, etc.)
    if (toSo.match(/^14[a-e]$/)) {
      // Sub-sheets 14a to 14e
      // Handled as valid
    } else {
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
        // If coming after 14e
        if (prevEnd === 14 && s === 15) {
          // valid transition
        } else if (prevEnd !== 0 && s !== prevEnd + 1 && prevEnd !== '14e') {
          console.log(`Gap/overlap at row ${rowIdx} STT ${stt}: prevEnd=${prevEnd}, s=${s}`);
          gapCount++;
        }
      }
      prevEnd = e;
    }
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

async function main() {
  await verifyExcel('PL_2021_21Q.xlsx', 15, 30);
  await verifyExcel('PL_2021_21R.xlsx', 157, 358);
}

main().catch(console.error);
