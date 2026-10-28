import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function stackCovers() {
  const dir = 'tests/inspect_batch2015_3';
  const pairs = [
    ['PL_2015_15G_001.jpg', 'PL_2015_15G_002.jpg'],
    ['PL_2015_15I_001.jpg', 'PL_2015_15I_002.jpg'],
    ['PL_2015_15L_001.jpg', 'PL_2015_15L_002.jpg']
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
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(dir, 'grid_covers_3.jpg'));
  console.log('Saved grid_covers_3.jpg');
}
stackCovers();
