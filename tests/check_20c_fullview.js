import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const cDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20C';
const outDir = 'tests/inspect_batch/PL_2020_20C/check_names';

async function cropFull() {
  const list = ['009.jpg', '010.jpg', '011.jpg', '012.jpg', '018.jpg'];
  for (const fn of list) {
    const src = path.join(cDir, fn);
    await sharp(src)
      .resize(null, 1200)
      .toFile(path.join(outDir, `fullview_${fn}`));
  }
  console.log('Saved fullview');
}

cropFull();
