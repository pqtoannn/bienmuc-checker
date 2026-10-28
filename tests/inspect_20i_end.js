import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20I';
const outDir = 'tests/inspect_batch/PL_2020_20I';
fs.mkdirSync(outDir, { recursive: true });

async function check20IEnd() {
  for (const p of [106, 107, 108]) {
    const fn = String(p).padStart(3, '0') + '.jpg';
    await sharp(path.join(dDir, fn))
      .resize(1000)
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, `view_${fn}`));
  }
}

check20IEnd();
