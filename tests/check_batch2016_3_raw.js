import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';
const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const dossiers = ['PL_2016_16E', 'PL_2016_16B', 'PL_2016_16K'];

async function check() {
  for (const dos of dossiers) {
    console.log('=== ' + dos + ' ===');
    const pDir = path.join(P_PHOTOS, dos);
    const photos = fs.readdirSync(pDir).filter(f => f.endsWith('.jpg')).sort();
    console.log('Photos count:', photos.length, photos.slice(0, 5), '...', photos.slice(-3));

    const xlsxPath = path.join(P_RAW_EXCEL, dos + '.xlsx');
    if (fs.existsSync(xlsxPath)) {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(xlsxPath);
      const ws = wb.worksheets[0];
      console.log('Worksheet rowCount:', ws.rowCount);
      for (let r = 1; r <= Math.min(ws.rowCount, 12); r++) {
        const row = ws.getRow(r);
        const vals = [1,2,3,4,5,6,7,8].map(c => row.getCell(c).text?.trim() || '');
        if (vals.some(v => v)) {
          console.log(`Row ${r}:`, JSON.stringify(vals));
        }
      }
    } else {
      console.log('Raw excel NOT FOUND:', xlsxPath);
    }

    const jobPath = path.join(P_OUTPUT_OCR, dos + '.job.json');
    if (fs.existsSync(jobPath)) {
      const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
      console.log('Job title:', job.data?.tenHoSo);
    }
  }
}
check();
