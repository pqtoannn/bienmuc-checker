import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function checkBlue() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15D';
  const outDir = 'tests/inspect_batch2015_4/15D';

  for (const f of ['105.jpg', '106.jpg', '107.jpg', '108.jpg']) {
    await sharp(path.join(pPhotos, f)).resize(700).jpeg({ quality: 85 }).toFile(path.join(outDir, 'overview_' + f));
  }
  console.log('Saved overviews 105-108');
}

checkBlue();
