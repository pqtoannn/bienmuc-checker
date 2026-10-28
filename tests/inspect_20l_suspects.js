import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20L';
const outDir = 'tests/inspect_batch/PL_2020_20L/suspects';
fs.mkdirSync(outDir, { recursive: true });

async function check90to96() {
  for (const p of [90, 91, 92, 93, 94, 95, 96]) {
    const fn = String(p).padStart(3, '0') + '.jpg';
    await sharp(path.join(dDir, fn))
      .resize(1000)
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, `full_${fn}`));
  }
}

check90to96();
