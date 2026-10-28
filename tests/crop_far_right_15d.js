import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function cropFarRight() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15D';
  const outDir = 'tests/inspect_batch2015_4/15D';
  const files = ['002.jpg', '003.jpg', '004.jpg', '005.jpg', '006.jpg', '007.jpg', '008.jpg'];
  const W = 200, H = 150;
  const cols = 4;
  const rows = 2;
  const canvas = sharp({
    create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const meta = await sharp(path.join(pPhotos, f)).metadata();
    const b = await sharp(path.join(pPhotos, f))
      .extract({ left: Math.round(meta.width * 0.86), top: 0, width: Math.round(meta.width * 0.14), height: Math.round(meta.height * 0.20) })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
    composites.push({ input: svg, left: col * W, top: row * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 90 }).toFile(path.join(outDir, 'grid_far_right_15d.jpg'));
  console.log('Saved grid_far_right_15d.jpg');
}
cropFarRight();
