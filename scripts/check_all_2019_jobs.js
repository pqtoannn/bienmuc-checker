import fs from 'fs';
import path from 'path';

const photoBase = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const ocrBase = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';

const dirs = fs.readdirSync(photoBase).filter(d => d.startsWith('PL_2019_'));

console.log('Dossier\t\tPhotos\tJobExists\tJobImages\tJobRows');
for (const d of dirs.sort()) {
  const pDir = path.join(photoBase, d);
  const photos = fs.readdirSync(pDir).filter(f => f.endsWith('.jpg')).length;
  const jPath = path.join(ocrBase, `${d}.job.json`);
  let jImages = 0;
  let jRows = 0;
  if (fs.existsSync(jPath)) {
    const job = JSON.parse(fs.readFileSync(jPath, 'utf8'));
    jImages = job.images ? job.images.length : 0;
    jRows = job.data && job.data.rows ? job.data.rows.length : 0;
  }
  console.log(`${d}\t${photos}\t${fs.existsSync(jPath)}\t\t${jImages}\t\t${jRows}`);
}
