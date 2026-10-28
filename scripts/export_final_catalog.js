import fs from 'fs';
import ExcelJS from 'exceljs';
import xlsx from 'xlsx';

const dirVHXH = 'C:/Users/Toan/Downloads/Tong_hop_BM_BoSung/PL_VHXH_59HS';
const dirKT = 'C:/Users/Toan/Downloads/Tong_hop_BM_BoSung/PhuLoc_KeToan_17HS_24_10';

const vhxhJson = JSON.parse(fs.readFileSync('d:/BG/Check_HS_BM/danh_muc_PL_VHXH.json', 'utf-8'));
const ktJson = JSON.parse(fs.readFileSync('d:/BG/Check_HS_BM/danh_muc_PL_KT.json', 'utf-8'));

function parseDate(dStr) {
  if (!dStr) return null;
  const m = String(dStr).match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (!m) return null;
  const day = parseInt(m[1]), month = parseInt(m[2]), year = parseInt(m[3]);
  if (year < 1990 || year > 2030 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return {
    d: day, m: month, y: year,
    dateObj: new Date(year, month - 1, day),
    formatted: (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year
  };
}

function cleanTitleDeep(raw) {
  if (!raw) return '';
  let s = raw.trim();
  
  // Normalize prefix
  s = s.replace(/^(HỐ\s+SƠ|HỒ\s+SƠ|HS)\s+(V\/V|V\/v|v\/v|về việc|VỀ VIỆC)\s+/i, 'hồ sơ về việc ');
  if (!s.toLowerCase().startsWith('hồ sơ ')) {
    s = 'hồ sơ về việc ' + s;
  }
  if (s.toLowerCase().startsWith('hồ sơ xây dựng ')) {
    s = s.replace(/^hồ sơ xây dựng /i, 'hồ sơ về việc xây dựng ');
  }
  
  // Fix typos
  s = s.replace(/chi tiêu/gi, 'chỉ tiêu')
       .replace(/cơ sỡ/gi, 'cơ sở')
       .replace(/xây đựng/gi, 'xây dựng')
       .replace(/xây đật chuẩn/gi, 'xây dựng xã đạt chuẩn')
       .replace(/viễ xây dựng/gi, 'việc xây dựng')
       .replace(/hệ thông/gi, 'hệ thống')
       .replace(/nông thông mới/gi, 'nông thôn mới')
       .replace(/của ubnd theo/gi, 'của UBND xã Phú Lộc theo')
       .replace(/của xã phú lộc/gi, 'của UBND xã Phú Lộc')
       .replace(/của xã pl/gi, 'của UBND xã Phú Lộc')
       .replace(/sản xuât/gi, 'sản xuất')
       .replace(/tiêu chí sô/gi, 'tiêu chí số')
       .replace(/y yế/gi, 'y tế')
       .replace(/về về việc/gi, 'về việc');

  // Convert to lowercase
  s = s.toLowerCase();

  // Restore acronyms and proper names
  s = s.replace(/\bubnd\b/g, 'UBND')
       .replace(/\bbcđ\b/g, 'BCĐ')
       .replace(/\bntm\b/g, 'NTM')
       .replace(/\bqđ\b/g, 'QĐ')
       .replace(/\bkh\b/g, 'KH')
       .replace(/\bphú lộc\b/g, 'Phú Lộc')
       .replace(/\btân phú\b/g, 'Tân Phú')
       .replace(/\bđồng nai\b/g, 'Đồng Nai');

  // Remove trailing year
  s = s.replace(/\s+năm\s+\d{4}$/i, '');

  // Capitalize first letter
  s = s.charAt(0).toUpperCase() + s.slice(1);
  s = s.replace(/\s+/g, ' ')
       .replace(/\s*;\s*,?\s*/g, '; ')
       .replace(/\s*,\s*/g, ', ')
       .replace(/\s*:\s*/g, ': ')
       .trim();
  return s;
}

// 1. Process VHXH
const vhxhFiles = fs.readdirSync(dirVHXH).filter(f => f.endsWith('.xlsx')).sort((a,b) => {
  const numA = parseInt(a.match(/\d+/)[0]);
  const numB = parseInt(b.match(/\d+/)[0]);
  return numA - numB;
});

const vhxhProcessed = [];

for (const f of vhxhFiles) {
  const code = f.replace('.xlsx', '');
  const wb = xlsx.readFile(dirVHXH + '/' + f);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
  
  const parsedDates = [];
  let lastPage = 0;
  
  for (let r = 5; r < data.length; r++) {
    const row = data[r];
    if (!row) continue;
    const dateCell = row[2] ? String(row[2]).trim() : '';
    const p = parseDate(dateCell);
    if (p) parsedDates.push(p);
    
    const pageCell = row[5] ? String(row[5]).trim() : '';
    if (pageCell) {
      const pMatch = pageCell.match(/(\d+)(?!.*\d)/);
      if (pMatch) {
        const val = parseInt(pMatch[1]);
        if (val > lastPage) lastPage = val;
      }
    }
  }
  
  parsedDates.sort((a, b) => a.dateObj - b.dateObj);
  const minDate = parsedDates.length > 0 ? parsedDates[0].formatted : '';
  const maxDate = parsedDates.length > 0 ? parsedDates[parsedDates.length - 1].formatted : '';
  const endYear = parsedDates.length > 0 ? parsedDates[parsedDates.length - 1].y : null;
  
  let headerYear = '';
  for (let r = 0; r < 5; r++) {
    if (data[r] && data[r][0] && String(data[r][0]).startsWith('Năm ')) {
      headerYear = String(data[r][0]).replace('Năm ', '').trim();
    }
  }
  
  const finalYear = endYear ? endYear : (headerYear ? parseInt(headerYear) : 2024);
  
  const jsonItem = vhxhJson.find(x => x.ma_folder === code);
  let rawTitle = jsonItem ? jsonItem.tieu_de_ho_so : '';
  let cleanTitle = cleanTitleDeep(rawTitle);
  
  vhxhProcessed.push({
    code,
    file: f,
    cleanTitle,
    minDate,
    maxDate,
    dateRangeText: minDate && maxDate ? (minDate === maxDate ? minDate : (minDate + '\n' + maxDate)) : '',
    finalYear,
    lastPage: lastPage || '',
    note: 'Mã HS nguồn: ' + code + '; tệp: ' + f + '; tiêu đề chuẩn hóa đối chiếu ảnh bìa và biên mục Excel.'
  });
}

// 2. Process KT
const ktFiles = fs.readdirSync(dirKT).filter(f => f.endsWith('.xlsx')).sort((a,b) => {
  const numA = parseInt(a.match(/\d+/)[0]);
  const numB = parseInt(b.match(/\d+/)[0]);
  return numA - numB;
});

const ktProcessed = [];

for (const f of ktFiles) {
  const code = f.replace('.xlsx', '');
  const wb = xlsx.readFile(dirKT + '/' + f);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
  
  const parsedDates = [];
  let lastPage = 0;
  
  for (let r = 6; r < data.length; r++) {
    const row = data[r];
    if (!row) continue;
    const dateCell = row[2] ? String(row[2]).trim() : '';
    const p = parseDate(dateCell);
    if (p) parsedDates.push(p);
    
    const pageCell = row[5] ? String(row[5]).trim() : '';
    if (pageCell) {
      const pMatch = pageCell.match(/(\d+)(?!.*\d)/);
      if (pMatch) {
        const val = parseInt(pMatch[1]);
        if (val > lastPage) lastPage = val;
      }
    }
  }
  
  parsedDates.sort((a, b) => a.dateObj - b.dateObj);
  const minDate = parsedDates.length > 0 ? parsedDates[0].formatted : '';
  const maxDate = parsedDates.length > 0 ? parsedDates[parsedDates.length - 1].formatted : '';
  
  const jsonItem = ktJson.find(x => x.ma_folder === code);
  let rawTitle = jsonItem ? jsonItem.tieu_de_ho_so : '';
  let cleanTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
  cleanTitle = cleanTitle.replace(/chi tiêu/gi, 'chỉ tiêu').replace(/\s+/g, ' ').trim();
  
  const fiscalYearMatch = cleanTitle.match(/năm\s+(\d{4})/i);
  const fiscalYear = fiscalYearMatch ? parseInt(fiscalYearMatch[1]) : (jsonItem && jsonItem.thoi_gian ? parseInt(jsonItem.thoi_gian.replace('Năm ', '')) : 2001);
  
  ktProcessed.push({
    code,
    file: f,
    cleanTitle,
    minDate,
    maxDate,
    dateRangeText: minDate && maxDate ? (minDate === maxDate ? minDate : (minDate + '\n' + maxDate)) : '',
    finalYear: fiscalYear,
    lastPage: lastPage || '',
    note: 'Mã HS nguồn: ' + code + '; tệp: ' + f + '; tiêu đề trích xuất từ ảnh bìa hộp trắng PL_KT_Bia.'
  });
}

// Build Excel Workbook with ExcelJS
const workbook = new ExcelJS.Workbook();
workbook.creator = 'BienMuc Archival System';
workbook.lastModifiedBy = 'BienMuc';
workbook.created = new Date();
workbook.modified = new Date();

const sheet = workbook.addWorksheet('MLHS', {
  pageSetup: {
    paperSize: 9,
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0
  }
});

sheet.columns = [
  { header: 'Số hộp', key: 'soHop', width: 10 },
  { header: 'Số hồ sơ', key: 'soHS', width: 10 },
  { header: 'Nội dung hồ sơ', key: 'tieuDe', width: 64 },
  { header: 'Thời gian bắt đầu, kết thúc', key: 'thoiGian', width: 18 },
  { header: 'Số tờ', key: 'soTo', width: 10 },
  { header: 'Ghi chú', key: 'ghiChu', width: 36 }
];

const headerRow = sheet.getRow(1);
headerRow.height = 32;
headerRow.eachCell((cell) => {
  cell.font = { name: 'Times New Roman', size: 11, bold: true };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' }
  };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };
});

let currentHSNum = 1;

function addSectionHeader(title) {
  // Put text in cell 1 (col A), then merge A:F so it is visible everywhere
  const row = sheet.addRow([title, '', '', '', '', '']);
  const rowIdx = row.number;
  sheet.mergeCells(`A${rowIdx}:F${rowIdx}`);
  row.height = 28;
  const cell = row.getCell(1);
  cell.font = { name: 'Times New Roman', size: 12, bold: true, color: { argb: 'FF0D3C61' } };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E8F5' }
  };
  for (let c = 1; c <= 6; c++) {
    row.getCell(c).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
}

function addYearHeader(year) {
  // Put text in cell 1 (col A), then merge A:F
  const row = sheet.addRow([`Năm ${year}`, '', '', '', '', '']);
  const rowIdx = row.number;
  sheet.mergeCells(`A${rowIdx}:F${rowIdx}`);
  row.height = 24;
  const cell = row.getCell(1);
  cell.font = { name: 'Times New Roman', size: 11, bold: true, italic: true };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 2 };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF0F4F8' }
  };
  for (let c = 1; c <= 6; c++) {
    row.getCell(c).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
}

function addRecordRow(rec) {
  const row = sheet.addRow([
    '', // Số hộp
    currentHSNum,
    rec.cleanTitle,
    rec.dateRangeText,
    rec.lastPage || '',
    rec.note
  ]);
  
  row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
  row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
  row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
  row.getCell(6).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

  row.getCell(1).font = { name: 'Times New Roman', size: 11 };
  row.getCell(2).font = { name: 'Times New Roman', size: 11, bold: true };
  row.getCell(3).font = { name: 'Times New Roman', size: 11 };
  row.getCell(4).font = { name: 'Times New Roman', size: 10 };
  row.getCell(5).font = { name: 'Times New Roman', size: 11 };
  row.getCell(6).font = { name: 'Times New Roman', size: 9, italic: true, color: { argb: 'FF555555' } };

  for (let c = 1; c <= 6; c++) {
    row.getCell(c).border = {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
    };
  }

  currentHSNum++;
}

// Section VHXH
addSectionHeader('III. Tài liệu Văn hóa - Xã hội');
vhxhProcessed.sort((a, b) => {
  if (a.finalYear !== b.finalYear) return a.finalYear - b.finalYear;
  const numA = parseInt(a.code.match(/\d+/)[0]);
  const numB = parseInt(b.code.match(/\d+/)[0]);
  return numA - numB;
});

const vhxhYears = [...new Set(vhxhProcessed.map(x => x.finalYear))].sort((a,b) => a - b);
for (const y of vhxhYears) {
  addYearHeader(y);
  const items = vhxhProcessed.filter(x => x.finalYear === y);
  for (const item of items) addRecordRow(item);
}

// Section KT
addSectionHeader('IV. Tài liệu Tài chính - Kế toán');
ktProcessed.sort((a, b) => {
  if (a.finalYear !== b.finalYear) return a.finalYear - b.finalYear;
  const numA = parseInt(a.code.match(/\d+/)[0]);
  const numB = parseInt(b.code.match(/\d+/)[0]);
  return numA - numB;
});

const ktYears = [...new Set(ktProcessed.map(x => x.finalYear))].sort((a,b) => a - b);
for (const y of ktYears) {
  addYearHeader(y);
  const items = ktProcessed.filter(x => x.finalYear === y);
  for (const item of items) addRecordRow(item);
}

const outWorkspace = 'd:/BG/Check_HS_BM/Danh_muc_VHXH_Ke_toan_Phu_Loc_Chuan.xlsx';
const outDownload = 'C:/Users/Toan/Downloads/Danh_muc/Danh_muc_VHXH_Ke_toan_Phu_Loc.xlsx';

async function run() {
  await workbook.xlsx.writeFile(outWorkspace);
  console.log('Saved:', outWorkspace);
  await workbook.xlsx.writeFile(outDownload);
  console.log('Saved:', outDownload);
}

run();
