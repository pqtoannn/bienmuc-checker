import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function zoomPencils() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R';
  const outDir = 'tests/inspect_batch2019_8/19R_zoom2';
  fs.mkdirSync(outDir, { recursive: true });

  for (let n = 18; n <= 29; n++) {
    const fnStr = String(n).padStart(3, '0');
    const fn = path.join(dir, `${fnStr}.jpg`);
    const meta = await sharp(fn).metadata();
    const W = meta.width;
    const H = meta.height;

    // Crop top right corner around pencil
    await sharp(fn)
      .extract({
        left: Math.round(W * 0.70),
        top: Math.round(H * 0.05),
        width: Math.round(W * 0.28),
        height: Math.round(H * 0.20)
      })
      .resize(500, null, { fit: 'inside' })
      .jpeg({ quality: 95 })
      .toFile(path.join(outDir, `${fnStr}_pencil_zoom.jpg`));
  }

  // Make grid
  const cards = [];
  for (let n = 18; n <= 29; n++) {
    const fnStr = String(n).padStart(3, '0');
    const p = path.join(outDir, `${fnStr}_pencil_zoom.jpg`);
    const pBuf = await sharp(p).resize(260, 110, { fit: 'inside' }).toBuffer();
    const meta = await sharp(pBuf).metadata();

    const labelSvg = Buffer.from(
      `<svg width="90" height="110">
        <rect width="90" height="110" fill="#0f172a"/>
        <text x="45" y="60" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">${fnStr}.jpg</text>
      </svg>`
    );

    const card = await sharp({
      create: { width: 360, height: 110, channels: 3, background: { r: 245, g: 245, b: 245 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: pBuf, left: 95, top: Math.max(0, Math.floor((110 - meta.height) / 2)) }
    ])
    .jpeg()
    .toBuffer();

    cards.push(card);
  }

  const cols = 3;
  const rows = Math.ceil(cards.length / cols);
  const composites = [];
  for (let idx = 0; idx < cards.length; idx++) {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    composites.push({
      input: cards[idx],
      left: c * 370 + 10,
      top: r * 120 + 10
    });
  }

  await sharp({
    create: {
      width: cols * 370 + 10,
      height: rows * 120 + 10,
      channels: 3,
      background: { r: 203, g: 213, b: 225 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile('tests/inspect_batch2019_8/zoom_grid_18_29.jpg');

  console.log('Saved zoom_grid_18_29.jpg');
}

zoomPencils().catch(console.error);
