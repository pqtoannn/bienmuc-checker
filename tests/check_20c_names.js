import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const cDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20C';
const outDir = 'tests/inspect_batch/PL_2020_20C/check_names';
fs.mkdirSync(outDir, { recursive: true });

async function cropNames() {
  const list = ['007.jpg', '009.jpg', '010.jpg', '011.jpg', '012.jpg', '018.jpg'];
  for (const fn of list) {
    const src = path.join(cDir, fn);
    await sharp(src)
      .resize(900)
      .toFile(path.join(outDir, `view_${fn}`));
  }
  console.log('Saved check names');
}

cropNames();
