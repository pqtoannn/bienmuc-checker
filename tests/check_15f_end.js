import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function check15F_end() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15F';
  const outDir = 'tests/inspect_batch2015_4/15F';

  for (const f of ['144.jpg', '145.jpg', '146.jpg', '147.jpg', '148.jpg']) {
    await sharp(path.join(pPhotos, f)).resize(700).jpeg({ quality: 85 }).toFile(path.join(outDir, 'inspect_' + f));
  }
  console.log('Saved end files of 15F');
}

check15F_end();
