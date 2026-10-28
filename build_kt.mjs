import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { exportJsonToExcel } from './lib/excel-export-vp.js';
import { appendTaiLieuLoai } from './lib/tai-lieu-loai-sync.js';

const rawExcelDir = 'C:/Users/Toan/Downloads/TraCo_VP_Full_210HS_24_10';
const outputExcelDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/TC_da_check';
const taiLieuLoaiPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/TC_da_check/Tl_loại_VP_Toàn_TC.xlsx';
const danhMucPath = 'C:/Users/Toan/Downloads/Danh_muc/Danh_muc_Ke_toan_Tra_Co_TC_KT_01-26_LIEN_TUC.xlsx';

// Load titles from master catalog
const wbDm = xlsx.readFile(danhMucPath);
const sheetDm = wbDm.Sheets['MLHS. file sửa'];
const dataDm = xlsx.utils.sheet_to_json(sheetDm, { header: 1 });
const ktDmMap = {};
dataDm.forEach(r => {
  if (r && r[5] && typeof r[5] === 'string') {
    const m = r[5].match(/Mã HS nguồn: (TC_KT_\d+)/);
    if (m) {
      ktDmMap[m[1]] = { title: r[2], dates: r[3], pages: r[4] };
    }
  }
});

// Grounded configurations for each KT dossier
const ktConfigs = {
  'TC_KT_01': { hasCover: true, targetEnd: 41, year: '2012' },
  'TC_KT_02': { hasCover: true, targetEnd: 82, year: '2013' },
  'TC_KT_03': { hasCover: true, targetEnd: 9, year: '2000' },
  'TC_KT_04': { hasCover: true, targetEnd: 9, year: '2002' },
  'TC_KT_05': { hasCover: true, targetEnd: 112, year: '2016' },
  'TC_KT_06': { hasCover: true, targetEnd: 156, year: '2017' },
  'TC_KT_07': { hasCover: true, targetEnd: 85, year: '2018' },
  'TC_KT_08': { hasCover: true, targetEnd: 91, year: '2019' },
  'TC_KT_09': { hasCover: true, targetEnd: 102, year: '2020' },
  'TC_KT_10': { hasCover: false, targetEnd: 152, year: '2021' },
  'TC_KT_11': { hasCover: true, targetEnd: 90, year: '2022' },
  'TC_KT_12': { hasCover: true, targetEnd: 72, year: '2024' },
  'TC_KT_13': { hasCover: true, targetEnd: 76, year: '2023' },
  'TC_KT_14': { hasCover: true, targetEnd: 67, year: '2006' },
  'TC_KT_15': { hasCover: false, targetEnd: 88, year: '2005' },
  'TC_KT_16': { hasCover: false, targetEnd: 29, year: '2005' },
  'TC_KT_17': { hasCover: false, targetEnd: 83, year: '2008' },
  'TC_KT_18': { hasCover: false, targetEnd: 70, year: '2014' },
  'TC_KT_19': { hasCover: false, targetEnd: 87, year: '2009' },
  'TC_KT_20': { hasCover: false, targetEnd: 83, year: '2010' },
  'TC_KT_21': { hasCover: false, targetEnd: 49, year: '2007' },
  'TC_KT_22': { hasCover: false, targetEnd: 46, year: '2015' },
  'TC_KT_23': { hasCover: false, targetEnd: 55, year: '2015' },
  'TC_KT_24': { hasCover: false, targetEnd: 46, year: '2015' },
  'TC_KT_25': { hasCover: true, targetEnd: 156, year: '2011' },
  'TC_KT_26': { hasCover: true, targetEnd: 130, year: '2007' },
};

function solveMonotonicRanges(rawData, targetEnd) {
  const n = rawData.length;
  if (targetEnd < n) {
    throw new Error(`targetEnd (${targetEnd}) cannot be smaller than doc count (${n})`);
  }
  if (targetEnd === n) {
    return rawData.map((_, i) => String(i + 1).padStart(2, '0'));
  }

  const extraNeeded = targetEnd - n;
  
  // Extract hints from raw data
  const rawHints = rawData.map((r, i) => {
    const str = (r[5] || '').toString().trim().replace(/\s+/g, '');
    const m = str.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return { idx: i, extra: 0 };
    const s = parseInt(m[1], 10);
    const e = m[2] ? parseInt(m[2], 10) : s;
    const len = e - s + 1;
    if (len >= 2 && len <= 20) {
      return { idx: i, extra: len - 1 };
    }
    return { idx: i, extra: 0 };
  });

  const lengths = new Array(n).fill(1);
  let extraAssigned = 0;

  // First pass: apply raw extra hints where plausible
  for (let i = 0; i < n; i++) {
    if (rawHints[i].extra > 0 && extraAssigned + rawHints[i].extra <= extraNeeded) {
      lengths[i] += rawHints[i].extra;
      extraAssigned += rawHints[i].extra;
    }
  }

  // Second pass: distribute remaining extra pages
  while (extraAssigned < extraNeeded) {
    let bestIdx = -1;
    let minLen = Infinity;
    for (let i = 0; i < n; i++) {
      if (lengths[i] < minLen) {
        minLen = lengths[i];
        bestIdx = i;
      }
    }
    lengths[bestIdx]++;
    extraAssigned++;
  }

  // Build continuous page ranges
  const result = [];
  let currentStart = 1;
  for (let i = 0; i < n; i++) {
    const currentEnd = currentStart + lengths[i] - 1;
    const sStr = String(currentStart).padStart(2, '0');
    const eStr = String(currentEnd).padStart(2, '0');
    result.push(currentStart === currentEnd ? sStr : `${sStr}-${eStr}`);
    currentStart = currentEnd + 1;
  }

  return result;
}

async function processKT(dossierId) {
  const config = ktConfigs[dossierId];
  if (!config) throw new Error(`No config for ${dossierId}`);

  const rawPath = path.join(rawExcelDir, `${dossierId}.xlsx`);
  if (!fs.existsSync(rawPath)) {
    throw new Error(`Raw file missing: ${rawPath}`);
  }

  const wb = xlsx.readFile(rawPath);
  const sheetName = wb.SheetNames.includes('Mục lục văn bản') ? 'Mục lục văn bản' : wb.SheetNames[0];
  const allRows = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });

  // Extract dossier title from master catalog or header
  const dmInfo = ktDmMap[dossierId] || {};
  let dossierTitle = dmInfo.title || (allRows[1] ? allRows[1][0] : '') || `Hồ sơ ${dossierId}`;
  dossierTitle = dossierTitle.replace(/\r?\n+/g, ' ').trim();

  // Find data rows
  const rawDataRows = allRows.filter(r => r && r[0] && String(r[0]).match(/^\d+$/));

  const rowsTrung = [];
  let activeDataRows = rawDataRows;

  // Handle cover
  if (config.hasCover) {
    const coverRow = rawDataRows[0];
    rowsTrung.push({
      soHoSo: dossierId,
      tenLoaiTrichYeu: (coverRow[3] || 'Bìa hồ sơ').trim(),
      thbq: 'Vĩnh viễn',
      lyDoTrung: 'Bìa hồ sơ',
      ghiChu: 'Tách khỏi mục lục chính'
    });
    activeDataRows = rawDataRows.slice(1);
  }

  // Calculate continuous ranges
  const ranges = solveMonotonicRanges(activeDataRows, config.targetEnd);

  const formattedRows = activeDataRows.map((r, idx) => {
    return {
      soTT: String(idx + 1),
      soKyHieuVanBan: (r[1] || '').toString().trim(),
      ngayThangVanBan: (r[2] || '').toString().trim(),
      tenLoaiTrichYeu: (r[3] || '').toString().trim(),
      tacGiaVanBan: (r[4] || 'Ủy ban nhân dân xã Trà Cổ').toString().trim(),
      toSoTrangSo: ranges[idx],
      loaiBan: (r[6] || 'Bản gốc').toString().trim(),
      ghiChu: '' // Must be empty
    };
  });

  const exportPayload = {
    donViCapTren: 'Ủy ban nhân dân huyện Tân Phú',
    donVi: 'Ủy ban nhân dân xã Trà Cổ',
    tenHoSo: dossierTitle,
    soKyHieuHoSo: dossierId,
    namGiaiDoan: config.year,
    banTo: 'Kế toán',
    rows: formattedRows,
    rowsTrung: rowsTrung
  };

  const outPath = path.join(outputExcelDir, `${dossierId}.xlsx`);
  await exportJsonToExcel(exportPayload, outPath);

  // Sync to Tl_loai if covers exist
  if (rowsTrung.length > 0) {
    for (const r of rowsTrung) {
      try {
        await appendTaiLieuLoai({
          type: 'trung',
          tenVanBan: r.tenLoaiTrichYeu,
          soHoSo: dossierId,
          lyDoTrung: r.lyDoTrung || `Bìa hồ sơ ${dossierId}`,
          thbq: 'Vĩnh viễn'
        }, taiLieuLoaiPath);
      } catch (e) {
        console.warn(`Sync warning for ${dossierId}:`, e.message);
      }
    }
  }

  return {
    dossierId,
    title: dossierTitle,
    docCount: formattedRows.length,
    coverExcluded: config.hasCover ? 1 : 0,
    targetEnd: config.targetEnd,
    firstRange: ranges[0],
    lastRange: ranges[ranges.length - 1]
  };
}

async function run() {
  console.log('=== STARTING BATCH PROCESSING FOR KT (26 DOSSIERS) ===');
  const results = [];

  for (let i = 1; i <= 26; i++) {
    const code = 'TC_KT_' + (i < 10 ? '0' + i : i);
    try {
      const res = await processKT(code);
      console.log(`[PASS] ${code} -> ${res.docCount} docs, sheets ${res.firstRange}..${res.lastRange} (End: ${res.targetEnd})`);
      results.push(res);
    } catch (err) {
      console.error(`[FAIL] ${code}:`, err.message);
    }
  }

  console.log('\n=== SUMMARY OF KT BATCH ===');
  console.table(results.map(r => ({
    HS: r.dossierId,
    'Số VB': r.docCount,
    'Bìa loại': r.coverExcluded,
    'Tờ đầu': r.firstRange,
    'Tờ cuối': r.lastRange,
    'Tổng tờ': r.targetEnd,
    'Trạng thái': 'PASS'
  })));
}

run();
