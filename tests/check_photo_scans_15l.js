import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function checkPhotoScans() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15L';
  const outDir = 'tests/inspect_batch2015_3/15L';
  const files = ['023.jpg', '024.jpg', '026.jpg', '027.jpg', '070.jpg'];

  for (const f of files) {
    await sharp(path.join(pPhotos, f)).resize(600).jpeg({ quality: 80 }).toFile(path.join(outDir, 'check_stamp_' + f));
  }
  console.log('Saved check stamp files');
}

checkPhotoScans();
