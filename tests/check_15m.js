import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function check15M() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15M';
  const outDir = 'tests/inspect_batch2015_1/15M';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  for (let i = 1; i <= 6; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    await sharp(path.join(pPhotos, f)).resize({width: 800}).toFile(path.join(outDir, f));
  }
  console.log('Saved all 6 scans of 15M');
}
check15M();
