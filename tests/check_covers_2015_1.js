import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function checkCovers() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
  const outDir = 'tests/inspect_batch2015_1';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  for (const id of ['PL_2015_15B', 'PL_2015_15J', 'PL_2015_15M', 'PL_2015_15A']) {
    for (const f of ['001.jpg', '002.jpg']) {
      const p = path.join(pPhotos, id, f);
      if (fs.existsSync(p)) {
        await sharp(p).resize({width: 800}).toFile(path.join(outDir, `${id}_${f}`));
      }
    }
  }
  console.log('Saved covers for Batch 2015-1');
}
checkCovers();
