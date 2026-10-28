import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function cropStrip(start, end, outName) {
  const cards = [];
  for (let i = start; i <= end; i++) {
    const fn = String(i).padStart(3, '0');
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19K/${fn}.jpg`;
    if (!fs.existsSync(p)) continue;

    // crop top right (pencil)
    const pBuf = await sharp(p).extract({ left: 1450, top: 10, width: 450, height: 250 }).resize(220, 120).toBuffer();
    // crop top left (header)
    const hBuf = await sharp(p).extract({ left: 100, top: 100, width: 900, height: 300 }).resize(300, 120).toBuffer();

    const labelSvg = Buffer.from(
      `<svg width="550" height="25">
        <rect width="550" height="25" fill="#222"/>
        <text x="10" y="18" font-family="sans-serif" font-size="14" font-weight="bold" fill="#00ffcc">${fn}.jpg</text>
      </svg>`
    );

    const card = await sharp({
      create: { width: 550, height: 155, channels: 3, background: { r: 240, g: 240, b: 240 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: hBuf, left: 5, top: 30 },
      { input: pBuf, left: 320, top: 30 }
    ])
    .jpeg()
    .toBuffer();

    cards.push(card);
  }

  const rows = Math.ceil(cards.length / 2);
  const composites = [];
  for (let idx = 0; idx < cards.length; idx++) {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    composites.push({
      input: cards[idx],
      left: col * 560 + 10,
      top: row * 165 + 10
    });
  }

  await sharp({
    create: { width: 2 * 560 + 10, height: rows * 165 + 10, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(`tests/inspect_19K/${outName}.jpg`);

  console.log(`Saved tests/inspect_19K/${outName}.jpg`);
}

async function run() {
  await cropStrip(7, 26, 'strip_07_26');
  await cropStrip(27, 46, 'strip_27_46');
  await cropStrip(47, 66, 'strip_47_66');
  await cropStrip(67, 86, 'strip_67_86');
  await cropStrip(87, 99, 'strip_87_99');
}

run().catch(e => console.error(e));
