import fs from 'fs';
import path from 'path';

const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const oDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

for (const code of ['PL_2020_20K', 'PL_2020_20L']) {
  const pList = fs.readdirSync(path.join(pDir, code)).filter(f => f.endsWith('.jpg')).sort();
  const j = JSON.parse(fs.readFileSync(path.join(oDir, code + '.job.json'), 'utf8'));
  console.log('\n=== ' + code + ' ===');
  console.log('Photos count: ' + pList.length + ' from ' + pList[0] + ' to ' + pList[pList.length - 1]);
  console.log('Job rows count: ' + j.data.rows.length);
  console.log('tenHoSo: ' + j.data.tenHoSo);
  console.log('Cover row (0):', j.data.rows[0]?.sourceFileNames, j.data.rows[0]?.tenLoaiTrichYeu);
  console.log('First active (1):', j.data.rows[1]?.sourceFileNames, j.data.rows[1]?.soKyHieuVanBan, j.data.rows[1]?.toSoTrangSo);
  console.log('Last row:', j.data.rows[j.data.rows.length - 1]?.sourceFileNames, j.data.rows[j.data.rows.length - 1]?.soKyHieuVanBan, j.data.rows[j.data.rows.length - 1]?.toSoTrangSo);
}
