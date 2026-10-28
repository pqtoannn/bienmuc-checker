import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20J';
const outDir = 'tests/inspect_batch/PL_2020_20J';

async function compare1_3() {
  const b1 = await sharp(path.join(dDir, '001.jpg')).resize(800).jpeg().toBuffer();
  const b3 = await sharp(path.join(dDir, '003.jpg')).resize(800).jpeg().toBuffer();

  await sharp({
    create: { width: 1620, height: 1100, channels: 3, background: { r: 240, g: 240, b: 240 } }
  })
  .composite([
    { input: b1, left: 10, top: 10 },
    { input: b3, left: 820, top: 10 }
  ])
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'compare_001_003.jpg'));

  console.log('Saved compare_001_003.jpg');
}

compare1_3();
