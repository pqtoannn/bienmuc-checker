import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const bDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20B';
const outDir = 'tests/inspect_batch/PL_2020_20B/check_details';
fs.mkdirSync(outDir, { recursive: true });

async function cropChecks() {
  const list = ['029.jpg', '030.jpg', '031.jpg', '099.jpg', '100.jpg', '101.jpg', '102.jpg', '103.jpg', '104.jpg', '107.jpg', '108.jpg', '109.jpg'];
  for (const fn of list) {
    const src = path.join(bDir, fn);
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
  console.log('Finished check crops');
}

cropChecks();
