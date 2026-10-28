import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20J';
const outDir = 'tests/inspect_batch/PL_2020_20J';
fs.mkdirSync(outDir, { recursive: true });

async function inspect20J() {
  const files = fs.readdirSync(dDir).filter(f => f.endsWith('.jpg')).sort();
  for (const fn of files) {
    await sharp(path.join(dDir, fn))
      .resize(1000)
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, `view_${fn}`));
  }
  console.log(`Saved all ${files.length} views for 20J`);
}

inspect20J();
