import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20M';
const outDir = 'tests/inspect_batch/PL_2020_20M';
fs.mkdirSync(outDir, { recursive: true });

async function inspect20M() {
  const files = fs.readdirSync(dDir).filter(f => f.endsWith('.jpg')).sort();
  const tiles = [];

  for (const fn of files) {
    const src = path.join(dDir, fn);
    const buf = await sharp(src).resize(1000).toBuffer();

    // Full small view
    await sharp(buf).jpeg({ quality: 85 }).toFile(path.join(outDir, `view_${fn}`));

    // Crop for montage
    const tr = await sharp(buf).extract({ left: 750, top: 40, width: 240, height: 160 }).toBuffer();
    const tl = await sharp(buf).extract({ left: 40, top: 100, width: 450, height: 160 }).toBuffer();

    const labelSvg = Buffer.from(`
      <svg width="700" height="160">
        <rect width="700" height="160" fill="#fff"/>
        <text x="5" y="25" font-size="20" font-weight="bold" fill="#000">${fn}</text>
      </svg>
    `);

    const t = await sharp({ create: { width: 700, height: 160, channels: 3, background: { r: 240, g: 240, b: 240 } } })
      .composite([
        { input: labelSvg, left: 0, top: 0 },
        { input: tl, left: 80, top: 0 },
        { input: tr, left: 450, top: 0 }
      ])
      .jpeg()
      .toBuffer();

    tiles.push(t);
  }

  const cols = 2;
  const rows = Math.ceil(tiles.length / cols);
  const comp = tiles.map((t, i) => ({
    input: t,
    left: (i % cols) * 710,
    top: Math.floor(i / cols) * 170
  }));

  await sharp({
    create: { width: cols * 710, height: rows * 170, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(comp)
  .jpeg({ quality: 90 })
  .toFile(path.join(outDir, 'collage_20m.jpg'));

  console.log('Saved collage_20m.jpg');
}

inspect20M();
