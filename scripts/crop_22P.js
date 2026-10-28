import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const photoDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2022_22P';
const inspectDir = 'd:/BG/Check_HS_BM/tests/inspect_22P';

if (!fs.existsSync(inspectDir)) {
  fs.mkdirSync(inspectDir, { recursive: true });
}

async function run() {
  const files = fs.readdirSync(photoDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} images...`);

  for (const f of files) {
    const inputPath = path.join(photoDir, f);
    const num = f.replace('.jpg', '');

    // 1. Crop top-right corner (width: 550, height: 350)
    await sharp(inputPath)
      .extract({ left: 1920 - 550, top: 0, width: 550, height: 350 })
      .toFile(path.join(inspectDir, `${num}_tr.jpg`));

    // 2. Crop top header (left: 80, top: 20, width: 1760, height: 450)
    await sharp(inputPath)
      .extract({ left: 80, top: 20, width: 1760, height: 450 })
      .toFile(path.join(inspectDir, `${num}_hd.jpg`));
  }
  console.log('Finished cropping all 108 images');
}

run();
