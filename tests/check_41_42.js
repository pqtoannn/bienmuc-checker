import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const yDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21Y';
const outDir = 'tests/inspect_batch/PL_2021_21Y';

async function crop41_42() {
  for (const fn of ['040.jpg', '041.jpg', '042.jpg', '043.jpg']) {
    const src = path.join(yDir, fn);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({
        left: 0,
        top: 0,
        width: meta.width,
        height: Math.floor(meta.height * 0.45)
      })
      .resize(1000)
      .toFile(path.join(outDir, `check_${fn}`));
  }
  console.log('Cropped 040, 041, 042, 043');
}

crop41_42();
