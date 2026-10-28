import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  for (const n of ['014', '015', '016']) {
    await sharp(`C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19B/${n}.jpg`)
      .resize(1200)
      .toFile(`tests/inspect_19B/doubtful/${n}_full.jpg`);
  }
  console.log('Saved 014, 015, 016 full');
}

main().catch(console.error);
