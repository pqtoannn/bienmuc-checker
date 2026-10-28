import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function cropCheck() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21S';
  const outDir = 'tests/inspect_batch/PL_2021_21S/crops_check';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const targets = ['070.jpg', '071.jpg', '072.jpg', '135.jpg', '136.jpg', '137.jpg', '145.jpg', '146.jpg', '147.jpg', '152.jpg', '153.jpg', '154.jpg', '155.jpg'];
  for (const t of targets) {
    const src = path.join(dir, t);
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;
    // crop top right 35% width, 18% height
    await sharp(src)
      .extract({ left: Math.round(w * 0.65), top: 0, width: Math.round(w * 0.35), height: Math.round(h * 0.18) })
      .resize({ width: 600 })
      .jpeg({ quality: 90 })
      .toFile(path.join(outDir, 'crop_' + t));
  }
  console.log('Saved crops for questioned photos');
}
cropCheck();
