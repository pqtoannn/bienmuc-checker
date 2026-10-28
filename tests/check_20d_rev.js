import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const outDir = 'tests/inspect_batch/PL_2020_20D/check_rev';
import fs from 'fs';
fs.mkdirSync(outDir, { recursive: true });

async function checkRev() {
  const list = [225, 224, 223, 222, 221, 220, 219, 218, 217, 216, 215, 214, 213, 212, 211, 210, 209, 208, 207, 206, 205];
  for (const n of list) {
    const fn = `${String(n).padStart(3, '0')}.jpg`;
    const src = path.join(dDir, fn);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({
        left: Math.floor(meta.width * 0.75),
        top: Math.floor(meta.height * 0.02),
        width: Math.floor(meta.width * 0.25),
        height: Math.floor(meta.height * 0.2)
      })
      .resize(300)
      .toFile(path.join(outDir, `tr_${fn}`));
  }
  console.log('Saved rev check');
}
checkRev();
