import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19A';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function main() {
  for (const num of ['003', '004', '005']) {
    const fn = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19A/' + num + '.jpg';
    await sharp(fn)
      .extract({ left: 200, top: 20, width: 1400, height: 420 })
      .resize(700)
      .toFile(path.join(outDir, num + '_hdr.jpg'));
  }
  console.log('Saved test headers');
}

main().catch(console.error);
