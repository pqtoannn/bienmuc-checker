import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const bDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20B';
const outDir = 'tests/inspect_batch/PL_2020_20B';

async function checkSample() {
  for (const fn of ['002.jpg', '003.jpg', '004.jpg', '005.jpg', '010.jpg', '050.jpg']) {
    const src = path.join(bDir, fn);
    await sharp(src)
      .resize(800)
      .toFile(path.join(outDir, `sample_${fn}`));
  }
  console.log('Sample images saved');
}

checkSample();
