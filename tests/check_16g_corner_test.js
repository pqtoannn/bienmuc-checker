import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  for (const f of ['002.jpg', '003.jpg', '004.jpg', '005.jpg', '006.jpg']) {
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.82),
        top: Math.round(meta.height * 0.25),
        width: Math.round(meta.width * 0.17),
        height: Math.round(meta.height * 0.20)
      })
      .resize({ width: 300 })
      .toFile('tests/inspect_batch2016_5/test_corner_' + f);
  }
  console.log('Saved test corners 002-006');
}
main();
