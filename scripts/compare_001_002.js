import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

// Let's crop the text on 001.jpg and 002.jpg to see what handwriting is on 001
async function compare001and002() {
  const p1 = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/001.jpg';
  const p2 = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/002.jpg';
  
  await sharp(p1).resize(1200).toFile('tests/inspect_batch2019_8/19R_details/001_view.jpg');
  await sharp(p2).resize(1200).toFile('tests/inspect_batch2019_8/19R_details/002_view.jpg');
  console.log('Saved 001 and 002 view');
}

compare001and002().catch(console.error);
