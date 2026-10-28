import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const outDir = 'tests/inspect_batch/PL_2020_20D/check_20d_end';
fs.mkdirSync(outDir, { recursive: true });

async function cropEnds() {
  const list = ['205.jpg', '206.jpg', '207.jpg', '208.jpg', '221.jpg', '222.jpg'];
  for (const fn of list) {
    const src = path.join(dDir, fn);
    await sharp(src)
      .resize(900)
      .toFile(path.join(outDir, `view_${fn}`));
  }
  console.log('Saved check ends');
}

cropEnds();
