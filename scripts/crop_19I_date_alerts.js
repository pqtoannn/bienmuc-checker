import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19I/date_alerts';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  for (const fn of ['018', '027', '125', '169']) {
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19I/${fn}.jpg`;
    await sharp(p)
      .extract({ left: 750, top: 180, width: 650, height: 200 })
      .toFile(path.join(outDir, `${fn}_date.jpg`));
    await sharp(p)
      .extract({ left: 150, top: 120, width: 600, height: 250 })
      .toFile(path.join(outDir, `${fn}_num.jpg`));
  }
  console.log('Saved date alerts');
}

run();
