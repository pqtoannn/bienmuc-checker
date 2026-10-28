import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function makeTopStrip() {
  const strips = [];
  for (let i = 2; i <= 13; i++) {
    const fn = String(i).padStart(3, '0');
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19L/${fn}.jpg`;
    if (!fs.existsSync(p)) continue;

    const topBuf = await sharp(p).extract({ left: 1300, top: 0, width: 620, height: 250 }).resize(400, 150).toBuffer();

    const labelSvg = Buffer.from(
      `<svg width="500" height="30">
        <rect width="500" height="30" fill="#222"/>
        <text x="10" y="20" font-family="sans-serif" font-size="16" font-weight="bold" fill="#00ffcc">${fn}.jpg</text>
      </svg>`
    );

    const card = await sharp({
      create: { width: 500, height: 185, channels: 3, background: { r: 240, g: 240, b: 240 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: topBuf, left: 50, top: 35 }
    ])
    .jpeg()
    .toBuffer();

    strips.push(card);
  }

  // 2 columns, 6 rows
  const composites = [];
  for (let idx = 0; idx < strips.length; idx++) {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    composites.push({
      input: strips[idx],
      left: col * 510 + 10,
      top: row * 195 + 10
    });
  }

  await sharp({
    create: { width: 1040, height: 6 * 195 + 10, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile('tests/inspect_19L/top_strips.jpg');

  console.log('Saved top strips');
}

makeTopStrip().catch(e => console.error(e));
