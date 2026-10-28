import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19B/pencil_strips';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function makePencilStrips() {
  const cellW = 320;
  const cellH = 120;
  const cards = [];

  for (let i = 2; i <= 100; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19B/${fnStr}.jpg`;
    if (!fs.existsSync(fn)) continue;

    // Crop top-right corner where pencil is
    const pencilBuf = await sharp(fn)
      .extract({ left: 1300, top: 0, width: 550, height: 250 })
      .resize(230, 110, { fit: 'fill' })
      .toBuffer();

    const labelSvg = Buffer.from(
      `<svg width="80" height="110">
        <rect width="80" height="110" fill="#222"/>
        <text x="10" y="60" font-family="sans-serif" font-size="18" font-weight="bold" fill="#00ffcc">${fnStr}</text>
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
      { input: labelSvg, left: 5, top: 5 },
      { input: pencilBuf, left: 85, top: 5 }
    ])
    .jpeg()
    .toBuffer();

    cards.push({ fnStr, card });
  }

  // Group into collages of 20 cards (4 columns x 5 rows)
  const cols = 4;
  const rows = 5;
  const perPage = cols * rows; // 20

  for (let p = 0; p < Math.ceil(cards.length / perPage); p++) {
    const batch = cards.slice(p * perPage, (p + 1) * perPage);
    const composites = [];
    for (let idx = 0; idx < batch.length; idx++) {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      composites.push({
        input: batch[idx].card,
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
    .toFile(path.join(outDir, `pencil_page_${p + 1}.jpg`));
  }

  console.log('Saved all pencil pages');
}

makePencilStrips().catch(console.error);
