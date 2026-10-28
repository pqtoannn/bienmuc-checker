import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function checkCovers() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
  const outDir = 'tests/inspect_batch2015_3';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const dossiers = ['PL_2015_15G', 'PL_2015_15I', 'PL_2015_15L'];

  for (const dos of dossiers) {
    for (const f of ['001.jpg', '002.jpg']) {
      const src = path.join(pPhotos, dos, f);
      if (fs.existsSync(src)) {
        await sharp(src).resize(600).jpeg({ quality: 80 }).toFile(path.join(outDir, `${dos}_${f}`));
      }
    }
  }
  console.log('Covers exported to ' + outDir);
}

checkCovers();
