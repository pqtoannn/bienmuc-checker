import xlsx from 'xlsx';

function verifyExcel(path, name, expectedRows, expectedMaxSheet) {
  console.log(`\n--- VERIFYING ${name} ---`);
  const wb = xlsx.readFile(path);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  console.log('Title row 1:', rows[1]?.[0]);
  console.log('Title row 2:', rows[2]?.[0]);
  console.log('Title row 3:', rows[3]?.[0]);

  // Find header row (STT, Số, ký hiệu...)
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i]?.[0] === 'STT') {
      headerIdx = i;
      break;
    }
  }

  const dataRows = rows.slice(headerIdx + 2); // skip (1) (2)...
  console.log(`Total data rows: ${dataRows.length} (expected ${expectedRows})`);

  let prevEnd = 0;
  let allContinuous = true;
  let anyGhiChu = false;

  dataRows.forEach((r, idx) => {
    const stt = r[0];
    const so = r[1];
    const ngay = r[2];
    const trichYeu = r[3];
    const toSo = String(r[5] || '').trim();
    const loai = r[6];
    const ghiChu = r[7];

    if (ghiChu) anyGhiChu = true;

    // Check continuous
    let s, e;
    if (toSo.includes('-')) {
      const parts = toSo.split('-').map(x => parseInt(x, 10));
      s = parts[0];
      e = parts[1];
    } else {
      s = parseInt(toSo, 10);
      e = s;
    }

    if (s !== prevEnd + 1) {
      console.log(`Discontinuity at row ${stt}: prevEnd=${prevEnd}, curStart=${s}`);
      allContinuous = false;
    }
    prevEnd = e;

    if (idx === 0 || idx === dataRows.length - 1) {
      console.log(`Row ${stt}: So=${so} | Ngay=${ngay} | ToSo=${toSo} | Loai=${loai} | GhiChu=${ghiChu || '""'}`);
    }
  });

  console.log(`Final sheet: ${prevEnd} (expected ${expectedMaxSheet})`);
  console.log(`Continuous: ${allContinuous}`);
  console.log(`Any ghiChu: ${anyGhiChu}`);
}

verifyExcel('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/PL_2021_21m.xlsx', 'PL_2021_21m', 57, 71);
verifyExcel('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check/PL_2021_21n.xlsx', 'PL_2021_21n', 93, 244);
