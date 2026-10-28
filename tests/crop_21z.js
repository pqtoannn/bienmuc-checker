import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const zPhotosDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21Z';
const outDir = 'tests/inspect_batch/PL_2021_21Z/details';
fs.mkdirSync(outDir, { recursive: true });

async function cropZ() {
  for (let i = 1; i <= 7; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const src = path.join(zPhotosDir, fn);
    const meta = await sharp(src).metadata();
    
    // Crop top half (to see header, recipient, sheet number, etc.)
    await sharp(src)
      .extract({
        left: 0,
        top: 0,
        width: meta.width,
        height: Math.floor(meta.height * 0.45)
      })
      .resize(1000)
      .toFile(path.join(outDir, `top_${fn}`));
      
    // Crop full page scaled to 800px width
    await sharp(src)
      .resize(800)
      .toFile(path.join(outDir, `full_${fn}`));
  }
  console.log('Finished cropping Z details');
}

cropZ().catch(console.error);
