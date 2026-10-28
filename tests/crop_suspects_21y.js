import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const yDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21Y';
const outDir = 'tests/inspect_batch/PL_2021_21Y/suspects';
import fs from 'fs';
fs.mkdirSync(outDir, { recursive: true });

async function cropSuspects() {
  const list = ['034.jpg', '088.jpg', '089.jpg', '090.jpg', '091.jpg', '100.jpg', '101.jpg'];
  for (const fn of list) {
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
      .toFile(path.join(outDir, `top_${fn}`));
  }
  console.log('Cropped suspect tops');
}
cropSuspects();
