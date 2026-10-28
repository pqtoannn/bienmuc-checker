import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19I/zoom';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const checkList = ['006', '007', '038', '039', '040', '042', '043', '127', '128', '134', '135', '136', '137', '138', '160', '161'];

async function run() {
  for (const fnStr of checkList) {
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19I/${fnStr}.jpg`;
    await sharp(fn)
      .extract({ left: 1300, top: 0, width: 600, height: 300 })
      .toFile(path.join(outDir, `${fnStr}_pencil.jpg`));
    await sharp(fn)
      .extract({ left: 150, top: 50, width: 900, height: 350 })
      .toFile(path.join(outDir, `${fnStr}_hdr.jpg`));
  }
  console.log('Saved 19I zooms');
}

run();
