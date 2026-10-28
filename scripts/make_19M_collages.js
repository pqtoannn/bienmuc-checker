import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19M/collages';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function makeBatchCollage(startNum, endNum, collageName) {
  const cellW = 550;
  const cellH = 180;
  const items = [];

  for (let i = startNum; i <= endNum; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19M/${fnStr}.jpg`;
    if (!fs.existsSync(fn)) continue;

    try {
      const leftBuf = await sharp(fn)
        .extract({ left: 100, top: 100, width: 1100, height: 380 })
        .resize(320, 140, { fit: 'fill' })
        .toBuffer();

      const rightBuf = await sharp(fn)
        .extract({ left: 1450, top: 20, width: 450, height: 260 })
        .resize(200, 140, { fit: 'inside' })
        .toBuffer();

      const labelSvg = Buffer.from(
        `<svg width="550" height="30">
          <rect width="550" height="30" fill="#222"/>
          <text x="10" y="20" font-family="sans-serif" font-size="16" font-weight="bold" fill="#00ffcc">${fnStr}.jpg</text>
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
        { input: rightBuf, left: 335, top: 35 }
      ])
      .jpeg()
      .toBuffer();

      items.push(card);
    } catch (err) {
      console.error(`Error processing ${fnStr}:`, err.message);
    }
  }

  if (items.length === 0) return;

  const rows = Math.ceil(items.length / 2);
  const composites = [];
  for (let idx = 0; idx < items.length; idx++) {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    composites.push({
      input: items[idx],
      left: col * (cellW + 10) + 10,
      top: row * (cellH + 10) + 10
    });
  }

  await sharp({
    create: {
      width: 2 * (cellW + 10) + 10,
      height: rows * (cellH + 10) + 10,
      channels: 3,
      background: { r: 210, g: 210, b: 210 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, collageName));

  console.log(`Saved ${collageName}`);
}

async function run() {
  await makeBatchCollage(1, 20, 'collage_01_20.jpg');
  await makeBatchCollage(21, 40, 'collage_21_40.jpg');
  await makeBatchCollage(41, 60, 'collage_41_60.jpg');
  await makeBatchCollage(61, 80, 'collage_61_80.jpg');
  await makeBatchCollage(81, 90, 'collage_81_90.jpg');
}

run().catch(e => console.error(e));
