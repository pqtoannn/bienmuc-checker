import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeZoomGrids() {
  const dir = 'tests/inspect_batch2019_8/19R_zoom';
  const outDir = 'tests/inspect_batch2019_8';

  const makeGrid = async (list, name) => {
    const cards = [];
    for (const n of list) {
      const fnStr = String(n).padStart(3, '0');
      const p = path.join(dir, `${fnStr}_pencil_zoom.jpg`);
      const pBuf = await sharp(p).resize(250, 100, { fit: 'inside' }).toBuffer();
      const meta = await sharp(pBuf).metadata();

      const labelSvg = Buffer.from(
        `<svg width="90" height="110">
          <rect width="90" height="110" fill="#0f172a"/>
          <text x="45" y="60" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">${fnStr}.jpg</text>
        </svg>`
      );

      const card = await sharp({
        create: { width: 350, height: 110, channels: 3, background: { r: 245, g: 245, b: 245 } }
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
        left: c * 360 + 10,
        top: r * 120 + 10
      });
    }

    await sharp({
      create: {
        width: cols * 360 + 10,
        height: rows * 120 + 10,
        channels: 3,
        background: { r: 203, g: 213, b: 225 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, `${name}.jpg`));
  };

  await makeGrid([20, 21, 22, 23, 24, 25, 26, 27, 28], 'zoom_grid_20_28');
  await makeGrid([29, 30, 31, 32, 33, 34], 'zoom_grid_29_34');
  console.log('Saved zoom grids');
}

makeZoomGrids().catch(console.error);
