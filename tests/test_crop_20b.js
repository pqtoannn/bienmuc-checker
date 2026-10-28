import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const bDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20B';
const outDir = 'tests/inspect_batch/PL_2020_20B';

async function testCrop() {
  for (const fn of ['002.jpg', '003.jpg', '004.jpg', '005.jpg']) {
    const src = path.join(bDir, fn);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({
        left: Math.floor(meta.width * 0.75),
        top: Math.floor(meta.height * 0.12),
        width: Math.floor(meta.width * 0.24),
        height: Math.floor(meta.height * 0.22)
      })
      .resize(400)
      .toFile(path.join(outDir, `crop_${fn}`));
  }
  console.log('Tested crop');
}

testCrop();
