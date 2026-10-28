import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function check51_52() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15L';
  const outDir = 'tests/inspect_batch2015_3/15L';

  for (const f of ['050.jpg', '051.jpg', '052.jpg']) {
    await sharp(path.join(pPhotos, f)).resize(700).jpeg({ quality: 85 }).toFile(path.join(outDir, 'inspect_' + f));
  }
  console.log('Saved inspect 050-052');
}

check51_52();
