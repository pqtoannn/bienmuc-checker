import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function stackCovers() {
  const dir = 'tests/inspect_batch2015_4';
  const pairs = [
    ['PL_2015_15D_001.jpg', 'PL_2015_15D_002.jpg'],
    ['PL_2015_15F_001.jpg', 'PL_2015_15F_002.jpg'],
    ['PL_2015_15K_001.jpg', 'PL_2015_15K_002.jpg']
  ];
  const W = 350, H = 220;
  const cols = 2;
  const rows = 3;
  const canvas = sharp({
    create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
  });
  const composites = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const f = pairs[r][c];
      const b = await sharp(path.join(dir, f)).resize(W, H).toBuffer();
      composites.push({ input: b, left: c * W, top: r * (H + 20) + 20 });
      const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
      composites.push({ input: svg, left: c * W, top: r * (H + 20) });
    }
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(dir, 'grid_covers_4.jpg'));
  console.log('Saved grid_covers_4.jpg');
}
stackCovers();
