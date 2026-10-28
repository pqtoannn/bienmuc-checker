import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const outDir = 'tests/inspect_batch/PL_2020_20D/check_193_204';
fs.mkdirSync(outDir, { recursive: true });

async function crop193_204() {
  for (let i = 193; i <= 204; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const src = path.join(dDir, fn);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({
        left: Math.floor(meta.width * 0.75),
        top: Math.floor(meta.height * 0.1),
        width: Math.floor(meta.width * 0.25),
        height: Math.floor(meta.height * 0.25)
      })
      .resize(400)
      .toFile(path.join(outDir, `crop_${fn}`));
  }
  console.log('Saved 193-204 crops');
}

crop193_204();
