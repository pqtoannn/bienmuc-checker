import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function stackCorners() {
  const dir = 'tests/inspect_batch2015_2/15H';
  const files = ['inspect_corner_016.jpg', 'inspect_corner_017.jpg', 'inspect_corner_018.jpg', 'inspect_corner_019.jpg'];
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
    const b = await sharp(path.join(dir, f)).resize(W, H).toBuffer();
    composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
    const name = f.replace('inspect_corner_', '');
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + name + '</text></svg>');
    composites.push({ input: svg, left: col * W, top: row * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 90 }).toFile(path.join(dir, 'grid_016_019.jpg'));
  console.log('Saved grid_016_019.jpg');
}
stackCorners();
