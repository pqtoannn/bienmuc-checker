import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function check56() {
  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19S/056.jpg';
  await sharp(p).resize(1200).toFile('tests/inspect_batch2019_9/19S_check/056_full.jpg');
  console.log('Saved 056_full.jpg');
}

check56().catch(console.error);
