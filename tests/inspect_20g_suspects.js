import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20G';
const outDir = 'tests/inspect_batch/PL_2020_20G/suspects';
fs.mkdirSync(outDir, { recursive: true });

const suspectP = [
  3, 6, 14, 17, 25, 26, 27, 30, 33, 36, 37, 42, 43, 48, 51, 66, 75, 83,
  93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106
];

async function cropSuspects() {
  const tiles = [];
  for (const p of suspectP) {
    const fn = String(p).padStart(3, '0') + '.jpg';
    const src = path.join(dDir, fn);
    const viewBuf = await sharp(src).resize(1000).toBuffer();
    
    // Top right crop
    const trCrop = await sharp(viewBuf)
      .extract({ left: 750, top: 40, width: 240, height: 160 })
      .toBuffer();

    // Top left/center (number / so ky hieu)
    const tlCrop = await sharp(viewBuf)
      .extract({ left: 40, top: 120, width: 350, height: 160 })
      .toBuffer();

    const labelSvg = Buffer.from(`
      <svg width="600" height="160">
        <rect width="600" height="160" fill="#fff"/>
        <text x="5" y="25" font-size="20" font-weight="bold" fill="#000">${fn}</text>
      </svg>
    `);

    const combined = await sharp({
      create: { width: 620, height: 170, channels: 3, background: { r: 230, g: 230, b: 230 } }
    })
    .composite([
      { input: labelSvg, left: 5, top: 5 },
      { input: tlCrop, left: 80, top: 5 },
      { input: trCrop, left: 375, top: 5 }
    ])
    .jpeg({ quality: 90 })
    .toBuffer();

    tiles.push(combined);
  }

  // Combine into 2 columns
  const cols = 2;
  const rows = Math.ceil(tiles.length / cols);
  const composites = tiles.map((t, i) => ({
    input: t,
    left: (i % cols) * 625,
    top: Math.floor(i / cols) * 175
  }));

  await sharp({
    create: {
      width: cols * 625,
      height: rows * 175,
      channels: 3,
      background: { r: 200, g: 200, b: 200 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'suspects_collage.jpg'));

  console.log('Saved suspects_collage.jpg');
}

cropSuspects();
