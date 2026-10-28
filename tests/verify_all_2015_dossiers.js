import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const dossiers2015 = [
  'PL_2015_15A',
  'PL_2015_15B',
  'PL_2015_15C',
  'PL_2015_15D',
  'PL_2015_15E',
  'PL_2015_15F',
  'PL_2015_15G',
  'PL_2015_15H',
  'PL_2015_15I',
  'PL_2015_15J',
  'PL_2015_15K',
  'PL_2015_15L',
  'PL_2015_15M'
];

function parseRange(str) {
  if (!str) return null;
  const cleaned = str.toString().trim().replace(/\s+/g, '');
  const m = cleaned.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  const s = parseInt(m[1], 10);
  const e = m[2] ? parseInt(m[2], 10) : s;
  return { start: s, end: e };
}

console.log('========================================================================');
console.log('COMPREHENSIVE FINAL INTEGRITY VERIFICATION - ALL 13 DOSSIERS YEAR 2015');
console.log('========================================================================');

const results = [];

dossiers2015.forEach(dosId => {
  const fDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  const fOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  const fJob = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);

  const existsDaCheck = fs.existsSync(fDaCheck);
  const existsOcr = fs.existsSync(fOcr);
  const existsJob = fs.existsSync(fJob);

  if (!existsDaCheck || !existsOcr || !existsJob) {
    results.push({ dosId, status: 'MISSING_FILES', existsDaCheck, existsOcr, existsJob });
    return;
  }

  const wb = xlsx.readFile(fDaCheck);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let dataStartIdx = 5;
  for (let i = 4; i < 10; i++) {
    if (rows[i] && (rows[i][0] === '1' || rows[i][0] === 1)) {
      dataStartIdx = i;
      break;
    }
  }

  const dataRows = rows.slice(dataStartIdx);
  let lastEnd = 0;
  let hasGap = false;
  let hasOverlap = false;
  let nonBlankGhiChu = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    const toSo = (r[5] || '').toString().trim();
    const pr = parseRange(toSo);
    if (!pr) {
      hasGap = true;
      break;
    }

    if (i === 0 && pr.start !== 1) {
      hasGap = true;
    }
    if (i > 0 && pr.start !== lastEnd + 1) {
      hasGap = true;
    }
    if (pr.end < pr.start) {
      hasOverlap = true;
    }

    const ghiChu = (r[7] || '').toString().trim();
    if (ghiChu !== '') {
      nonBlankGhiChu++;
    }

    lastEnd = pr.end;
  }

  const title = (rows[1] && rows[1][0]) ? rows[1][0] : '';
  results.push({
    dosId,
    title,
    activeRows: dataRows.length,
    finalSheet: lastEnd,
    isContinuous: !hasGap && !hasOverlap,
    nonBlankGhiChu,
    status: (!hasGap && !hasOverlap && nonBlankGhiChu === 0) ? 'OK' : 'ERROR'
  });
});

console.table(results);

const allOk = results.every(r => r.status === 'OK');
if (allOk && results.length === 13) {
  console.log('\n========================================================================');
  console.log('GRAND SUCCESS! ALL 13 DOSSIERS OF YEAR 2015 ARE 100% VERIFIED & STRICTLY CONTINUOUS!');
  console.log('========================================================================');
} else {
  console.error('\nERRORS FOUND IN 2015 DOSSIERS!');
  process.exit(1);
}
