import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makePencilGrids() {
  const dir = 'tests/inspect_batch2019_8/19R_details';
  const outDir = 'tests/inspect_batch2019_8';

  const cardW = 300;
  const cardH = 120;

  for (const [gridName, range] of [
    ['grid1', [1, 17]],
    ['grid2', [18, 34]]
  ]) {
    const cards = [];
    for (let i = range[0]; i <= range[1]; i++) {
      const fnStr = String(i).padStart(3, '0');
      const p = path.join(dir, `${fnStr}_pencil.jpg`);
      if (!fs.existsSync(p)) continue;

      const pBuf = await sharp(p).resize(200, 110, { fit: 'inside' }).toBuffer();
      const meta = await sharp(pBuf).metadata();

      const labelSvg = Buffer.from(
        `<svg width="90" height="${cardH}">
          <rect width="90" height="${cardH}" fill="#1e293b"/>
          <text x="45" y="65" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">${fnStr}.jpg</text>
        </svg>`
      );

      const card = await sharp({
        create: { width: cardW, height: cardH, channels: 3, background: { r: 245, g: 245, b: 245 } }
      })
      .composite([
        { input: labelSvg, left: 0, top: 0 },
        { input: pBuf, left: 95, top: Math.max(0, Math.floor((cardH - meta.height) / 2)) }
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
        left: c * (cardW + 10) + 10,
        top: r * (cardH + 10) + 10
      });
    }

    await sharp({
      create: {
        width: cols * (cardW + 10) + 10,
        height: rows * (cardH + 10) + 10,
        channels: 3,
        background: { r: 203, g: 213, b: 225 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, `pencil_${gridName}.jpg`));
  }

  console.log('Saved pencil grids 1 and 2!');
}

makePencilGrids().catch(console.error);
