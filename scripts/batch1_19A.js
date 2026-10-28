import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19A/batch1';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function processBatch() {
  const collageItems = [];
  const cellW = 500;
  const cellH = 180;

  for (let i = 2; i <= 21; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19A/${fnStr}.jpg`;
    if (!fs.existsSync(fn)) continue;

    // Header left
    const leftBuf = await sharp(fn)
      .extract({ left: 150, top: 20, width: 850, height: 320 })
      .resize(260, 140, { fit: 'fill' })
      .toBuffer();

    // Top-right pencil
    const rightBuf = await sharp(fn)
      .extract({ left: 1100, top: 0, width: 650, height: 260 })
      .resize(220, 140, { fit: 'fill' })
      .toBuffer();

    // SVG label
    const labelSvg = Buffer.from(
      `<svg width="500" height="30">
        <rect width="500" height="30" fill="#333"/>
        <text x="10" y="20" font-family="sans-serif" font-size="16" font-weight="bold" fill="#fff">${fnStr}.jpg</text>
      </svg>`
    );

    const card = await sharp({
      create: {
        width: cellW,
        height: cellH,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: leftBuf, left: 5, top: 35 },
      { input: rightBuf, left: 270, top: 35 }
    ])
    .jpeg()
    .toBuffer();

    collageItems.push({ fnStr, card });
  }

  // Make 2 collages of 10 items each (5 rows x 2 cols)
  for (let c = 0; c < 2; c++) {
    const batch = collageItems.slice(c * 10, (c + 1) * 10);
    const composites = [];
    for (let idx = 0; idx < batch.length; idx++) {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      composites.push({
        input: batch[idx].card,
        left: col * (cellW + 10) + 10,
        top: row * (cellH + 10) + 10
      });
    }

    await sharp({
      create: {
        width: 2 * (cellW + 10) + 10,
        height: 5 * (cellH + 10) + 10,
        channels: 3,
        background: { r: 210, g: 210, b: 210 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, `collage_01_${c + 1}.jpg`));
  }

  console.log('Saved collages 01_1 and 01_2');
}

processBatch().catch(console.error);
