import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function gridStamps() {
  const dir = 'tests/inspect_batch2015_3/15L';
  const files = ['check_stamp_023.jpg', 'check_stamp_024.jpg', 'check_stamp_026.jpg', 'check_stamp_027.jpg', 'check_stamp_070.jpg'];
  const W = 350, H = 250;
  const canvas = sharp({
    create: { width: W * 3, height: H * 2 + 40, channels: 3, background: { r: 15, g: 15, b: 15 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const col = i % 3;
    const row = Math.floor(i / 3);
    const b = await sharp(path.join(dir, f)).resize(W, H).toBuffer();
    composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
    const name = f.replace('check_stamp_', '');
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + name + '</text></svg>');
    composites.push({ input: svg, left: col * W, top: row * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(dir, 'grid_stamps_15L.jpg'));
  console.log('Saved grid_stamps_15L.jpg');
}

gridStamps();
