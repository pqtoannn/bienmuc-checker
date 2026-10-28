import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const aDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20A';
const outDir = 'tests/inspect_batch/PL_2020_20A/check_mid';
fs.mkdirSync(outDir, { recursive: true });

async function cropMid() {
  for (let i = 58; i <= 63; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const src = path.join(aDir, fn);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({
        left: 0,
        top: 0,
        width: meta.width,
        height: Math.floor(meta.height * 0.4)
      })
      .resize(1000)
      .toFile(path.join(outDir, `top_${fn}`));
  }
  console.log('Cropped 058-063');
}

cropMid();
