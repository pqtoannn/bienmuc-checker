import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19E/header_suspects';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const list = ['014', '017', '018', '022', '024', '028', '029', '030', '037', '038', '052', '065', '066', '067', '072', '073'];

async function run() {
  for (const fn of list) {
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19E/${fn}.jpg`;
    await sharp(p)
      .extract({ left: 100, top: 10, width: 1100, height: 400 })
      .resize(550, 200)
      .toFile(path.join(outDir, `${fn}_hdr.jpg`));
  }

  // Create collage
  const items = [];
  for (const fn of list) {
    const buf = await sharp(path.join(outDir, `${fn}_hdr.jpg`)).toBuffer();
    const labelSvg = Buffer.from(
      `<svg width="550" height="25"><rect width="550" height="25" fill="#222"/><text x="10" y="18" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffcc00">${fn}.jpg</text></svg>`
    );
    const card = await sharp({
      create: { width: 550, height: 225, channels: 3, background: { r: 240, g: 240, b: 240 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: buf, left: 0, top: 25 }
    ])
    .jpeg().toBuffer();
    items.push(card);
  }

  const cols = 2;
  const rows = Math.ceil(items.length / cols);
  const composites = [];
  for (let i = 0; i < items.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    composites.push({
      input: items[i],
      left: c * (550 + 10) + 10,
      top: r * (225 + 10) + 10
    });
  }

  await sharp({
    create: {
      width: cols * (550 + 10) + 10,
      height: rows * (225 + 10) + 10,
      channels: 3,
      background: { r: 200, g: 200, b: 200 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile('tests/inspect_19E/header_suspects_collage.jpg');

  console.log('Saved header_suspects_collage.jpg');
}

run();
