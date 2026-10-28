import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function check54_55() {
  const p54 = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19S/054.jpg';
  const p55 = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19S/055.jpg';
  await sharp(p54).resize(1200).toFile('tests/inspect_batch2019_9/19S_check/054_full.jpg');
  await sharp(p55).resize(1200).toFile('tests/inspect_batch2019_9/19S_check/055_full.jpg');
  console.log('Saved 054 and 055 full');
}

check54_55().catch(console.error);
