import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19B';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function main() {
  for (const num of ['004', '005', '006', '007', '008']) {
    await sharp('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19B/' + num + '.jpg')
      .resize(1000)
      .toFile(path.join(outDir, num + '_full.jpg'));
  }
  console.log('Saved 004-008 full');
}

main().catch(console.error);
