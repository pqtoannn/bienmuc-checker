import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19I';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function check19I() {
  await sharp('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19I/001.jpg').resize(800).toFile(path.join(outDir, '001_cover.jpg'));
  console.log('Saved 001_cover.jpg for 19I');
}

check19I();
