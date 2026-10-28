import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  for (const f of ['083.jpg', '084.jpg', '085.jpg', '086.jpg', '087.jpg', '088.jpg']) {
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.78),
        top: Math.round(meta.height * 0.05),
        width: Math.round(meta.width * 0.20),
        height: Math.round(meta.height * 0.16)
      })
      .resize({ width: 400 })
      .toFile('tests/inspect_batch2016_4/zoom_' + f);
  }
  console.log('Saved zooms');
}
main();
