import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function gridOverviews() {
  const dir = 'tests/inspect_batch2015_2/15C';
  const files = ['overview_004.jpg','overview_005.jpg','overview_006.jpg','overview_007.jpg','overview_008.jpg','overview_009.jpg','overview_010.jpg','overview_011.jpg','overview_012.jpg'];
  const W = 350, H = 220;
  const cols = 3;
  const rows = 3;
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
    const name = f.replace('overview_', '');
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + name + '</text></svg>');
    composites.push({ input: svg, left: col * W, top: row * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(dir, 'grid_004_012.jpg'));
  console.log('Saved grid_004_012.jpg');
}
gridOverviews();
