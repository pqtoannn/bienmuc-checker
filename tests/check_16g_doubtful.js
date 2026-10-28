import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const outDir = 'tests/inspect_batch2016_5/16G_doubtful';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  const checkList = [
    '007.jpg', '008.jpg', '009.jpg', '010.jpg',
    '036.jpg', '037.jpg', '038.jpg', '039.jpg',
    '158.jpg', '159.jpg', '160.jpg', '161.jpg', '162.jpg'
  ];

  for (const f of checkList) {
    await sharp(pDir + '/' + f)
      .resize({ width: 800 })
      .toFile(outDir + '/' + f);
  }
  console.log('Saved doubtful files for 16G');
}
main();
