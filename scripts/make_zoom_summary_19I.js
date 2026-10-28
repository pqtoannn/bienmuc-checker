import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19I';
const list = ['006', '007', '038', '039', '040', '042', '043', '127', '128', '134', '135', '136', '137', '138', '160', '161'];

async function run() {
  const cellW = 350;
  const cellH = 150;
  const items = [];

  for (const fnStr of list) {
    const fn = `tests/inspect_19I/zoom/${fnStr}_pencil.jpg`;
    const buf = await sharp(fn).resize(330, 110, { fit: 'inside' }).toBuffer();
    const labelSvg = Buffer.from(
      `<svg width="350" height="25"><rect width="350" height="25" fill="#111"/><text x="10" y="18" font-family="sans-serif" font-size="14" font-weight="bold" fill="#00ffcc">${fnStr}.jpg</text></svg>`
    );
    const card = await sharp({
      create: { width: cellW, height: cellH, channels: 3, background: { r: 240, g: 240, b: 240 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: buf, left: 10, top: 30 }
    ])
    .jpeg().toBuffer();
    items.push(card);
  }

  const cols = 2;
  const rows = Math.ceil(items.length / cols);
  const composites = [];
  for (let i = 0; i < items.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    composites.push({
      input: items[i],
      left: c * (cellW + 10) + 10,
      top: r * (cellH + 10) + 10
    });
  }

  await sharp({
    create: {
      width: cols * (cellW + 10) + 10,
      height: rows * (cellH + 10) + 10,
      channels: 3,
      background: { r: 200, g: 200, b: 200 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(path.join(outDir, 'zoom_summary_19I.jpg'));

  console.log('Saved zoom_summary_19I.jpg');
}

run();
