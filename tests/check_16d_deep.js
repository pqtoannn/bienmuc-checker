import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  const outDir = 'tests/inspect_batch2016_4/16D_deep';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  const files = [
    '069.jpg', '070.jpg', '071.jpg', '072.jpg', '073.jpg',
    '090.jpg', '091.jpg', '092.jpg', '093.jpg', '094.jpg',
    '098.jpg', '099.jpg', '100.jpg', '101.jpg', '102.jpg',
    '108.jpg', '109.jpg', '110.jpg', '111.jpg', '112.jpg'
  ];

  for (const f of files) {
    const meta = await sharp(pDir + '/' + f).metadata();
    // Crop top half
    await sharp(pDir + '/' + f)
      .extract({
        left: 0,
        top: 0,
        width: meta.width,
        height: Math.round(meta.height * 0.45)
      })
      .resize({width: 600})
      .toFile(outDir + '/' + f);
  }
  console.log('Saved top half for deep check files');
}
main();
