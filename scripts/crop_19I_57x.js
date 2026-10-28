import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19I/header_checks';

async function run() {
  for (const fn of ['153', '155', '158', '159', '164']) {
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19I/${fn}.jpg`;
    await sharp(p)
      .extract({ left: 150, top: 120, width: 600, height: 250 })
      .toFile(path.join(outDir, `${fn}_hdr.jpg`));
  }
  console.log('Saved 153, 155, 158, 159, 164');
}

run();
