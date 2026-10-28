import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  for (const num of ['099', '100']) {
    await sharp(`C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19B/${num}.jpg`)
      .resize(1000)
      .toFile(`tests/inspect_19B/${num}_full.jpg`);
  }
  console.log('Saved 099 and 100 full');
}

main().catch(console.error);
