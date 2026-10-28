import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19E';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function makeCover() {
  const fn = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19E/001.jpg';
  if (fs.existsSync(fn)) {
    await sharp(fn).resize(1200).toFile(path.join(outDir, '001_cover.jpg'));
    console.log('Saved 001_cover.jpg');
  }
}

async function makeBatchCollage(startNum, endNum, collageName) {
  const cellW = 500;
  const cellH = 180;
  const items = [];

  for (let i = startNum; i <= endNum; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19E/${fnStr}.jpg`;
    if (!fs.existsSync(fn)) continue;

    try {
      const leftBuf = await sharp(fn)
        .extract({ left: 150, top: 20, width: 850, height: 320 })
        .resize(260, 140, { fit: 'fill' })
        .toBuffer();

      const rightBuf = await sharp(fn)
        .extract({ left: 1100, top: 0, width: 650, height: 260 })
        .resize(220, 140, { fit: 'fill' })
        .toBuffer();

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
  await makeCover();
  await makeBatchCollage(1, 20, 'collage_01_20.jpg');
  await makeBatchCollage(21, 40, 'collage_21_40.jpg');
  await makeBatchCollage(41, 60, 'collage_41_60.jpg');
  await makeBatchCollage(61, 73, 'collage_61_73.jpg');
}

run();
