import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function stack50_52() {
  const dir = 'tests/inspect_batch2015_3/15L';
  const files = ['inspect_050.jpg', 'inspect_051.jpg', 'inspect_052.jpg'];
  const W = 350, H = 250;
  const canvas = sharp({
    create: { width: W * 3, height: H + 40, channels: 3, background: { r: 15, g: 15, b: 15 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const b = await sharp(path.join(dir, f)).resize(W, H).toBuffer();
    composites.push({ input: b, left: i * W, top: 20 });
    const name = f.replace('inspect_', '');
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + name + '</text></svg>');
    composites.push({ input: svg, left: i * W, top: 0 });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(dir, 'grid_050_052.jpg'));
  console.log('Saved grid_050_052.jpg');
}

stack50_52();
