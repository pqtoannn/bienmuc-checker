import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19G';

async function run() {
  for (let i = 110; i <= 118; i++) {
    const fn = String(i).padStart(3, '0');
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19G/${fn}.jpg`;
    if (fs.existsSync(p)) {
      await sharp(p).resize(600).toFile(path.join(outDir, `${fn}_view.jpg`));
    }
  }
  console.log('Saved 110-118 views');
}

run();
