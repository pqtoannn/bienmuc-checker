import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  for (const f of ['067.jpg', '068.jpg', '069.jpg', '070.jpg', '071.jpg', '072.jpg']) {
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.76),
        top: Math.round(meta.height * 0.04),
        width: Math.round(meta.width * 0.22),
        height: Math.round(meta.height * 0.16)
      })
      .resize({ width: 350 })
      .toFile('tests/inspect_batch2016_4/check_' + f);
  }
  console.log('Saved 067-072 corners');
}
main();
