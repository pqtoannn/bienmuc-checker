import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function cropCheck() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R';
  const outDir = 'tests/inspect_batch2019_8/check_dates';
  fs.mkdirSync(outDir, { recursive: true });

  for (const n of [13, 15, 19, 34]) {
    const fnStr = String(n).padStart(3, '0');
    const fn = path.join(dir, `${fnStr}.jpg`);
    await sharp(fn).resize(1200).toFile(path.join(outDir, `${fnStr}_full.jpg`));
  }
  console.log('Saved 13, 15, 19, 34 full');
}

cropCheck().catch(console.error);
