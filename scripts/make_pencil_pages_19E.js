import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19E';

async function makePencilGrid(startNum, endNum, outName) {
  const cellW = 200;
  const cellH = 120;
  const items = [];

  for (let i = startNum; i <= endNum; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19E/${fnStr}.jpg`;
    if (!fs.existsSync(fn)) continue;

    try {
      const pencilBuf = await sharp(fn)
        .extract({ left: 1100, top: 0, width: 650, height: 260 })
        .resize(190, 80, { fit: 'inside' })
        .toBuffer();

      const labelSvg = Buffer.from(
        `<svg width="200" height="25">
          <rect width="200" height="25" fill="#222"/>
          <text x="10" y="18" font-family="sans-serif" font-size="14" font-weight="bold" fill="#00ffcc">${fnStr}.jpg</text>
        </svg>`
      );

      const card = await sharp({
        create: {
          width: cellW,
          height: cellH,
          channels: 3,
          background: { r: 235, g: 235, b: 235 }
        }
      })
      .composite([
        { input: labelSvg, left: 0, top: 0 },
        { input: pencilBuf, left: 5, top: 30 }
      ])
      .jpeg()
      .toBuffer();

      items.push(card);
    } catch (err) {
      console.error(err);
    }
  }

  const cols = 4;
  const rows = Math.ceil(items.length / cols);
  const composites = [];
  for (let idx = 0; idx < items.length; idx++) {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    composites.push({
      input: items[idx],
      left: c * (cellW + 6) + 6,
      top: r * (cellH + 6) + 6
    });
  }

  await sharp({
    create: {
      width: cols * (cellW + 6) + 6,
      height: rows * (cellH + 6) + 6,
      channels: 3,
      background: { r: 180, g: 180, b: 180 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(path.join(outDir, outName));

  console.log(`Saved ${outName}`);
}

async function run() {
  await makePencilGrid(2, 25, 'pencils_02_25.jpg');
  await makePencilGrid(26, 49, 'pencils_26_49.jpg');
  await makePencilGrid(50, 73, 'pencils_50_73.jpg');
}

run();
