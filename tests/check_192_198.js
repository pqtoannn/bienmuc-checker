import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const outDir = 'tests/inspect_batch/PL_2020_20D/check_192_198';
fs.mkdirSync(outDir, { recursive: true });

async function checkRange() {
  for (let i = 190; i <= 210; i++) {
    const fn = `${String(i).padStart(3, '0')}.jpg`;
    const src = path.join(dDir, fn);
    const meta = await sharp(src).metadata();
    
    // Top right crop for sheet number
    await sharp(src)
      .extract({
        left: Math.floor(meta.width * 0.72),
        top: Math.floor(meta.height * 0.05),
        width: Math.floor(meta.width * 0.27),
        height: Math.floor(meta.height * 0.22)
      })
      .resize(400)
      .toFile(path.join(outDir, `tr_${fn}`));

    // Top left crop for header/soKyHieu
    await sharp(src)
      .extract({
        left: Math.floor(meta.width * 0.05),
        top: Math.floor(meta.height * 0.05),
        width: Math.floor(meta.width * 0.5),
        height: Math.floor(meta.height * 0.25)
      })
      .resize(500)
      .toFile(path.join(outDir, `tl_${fn}`));
  }
  console.log('Saved 190-210 tr and tl crops');
}
checkRange();
