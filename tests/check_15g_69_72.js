import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function check69_72() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15G';
  const outDir = 'tests/inspect_batch2015_3/15G';
  const files = ['069.jpg', '070.jpg', '071.jpg', '072.jpg'];
  const W = 350, H = 250;
  const cols = 2;
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
      .extract({ left: Math.round(meta.width * 0.78), top: 0, width: Math.round(meta.width * 0.22), height: Math.round(meta.height * 0.28) })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
    composites.push({ input: svg, left: col * W, top: row * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 90 }).toFile(path.join(outDir, 'grid_069_072.jpg'));
  console.log('Saved grid_069_072.jpg');
}
check69_72();
