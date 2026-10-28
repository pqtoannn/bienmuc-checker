import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function makePencilStrip() {
  const images = [];
  for (let i = 1; i <= 13; i++) {
    const fnStr = String(i).padStart(3, '0');
    const p = `tests/inspect_19L/${fnStr}_pencil.jpg`;
    if (!fs.existsSync(p)) continue;

    const labelSvg = Buffer.from(
      `<svg width="300" height="25">
        <rect width="300" height="25" fill="#333"/>
        <text x="10" y="18" font-family="sans-serif" font-size="14" font-weight="bold" fill="#00ffcc">Photo ${fnStr}</text>
      </svg>`
    );

    const card = await sharp({
      create: { width: 300, height: 185, channels: 3, background: { r: 255, g: 255, b: 255 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: await sharp(p).resize(300, 160, { fit: 'fill' }).toBuffer(), left: 0, top: 25 }
    ])
    .jpeg()
    .toBuffer();

    images.push(card);
  }

  // 2 columns, 7 rows
  const composites = [];
  const colW = 310;
  const rowH = 195;
  for (let idx = 0; idx < images.length; idx++) {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    composites.push({
      input: images[idx],
      left: col * colW + 10,
      top: row * rowH + 10
    });
  }

  await sharp({
    create: { width: 2 * colW + 10, height: Math.ceil(images.length / 2) * rowH + 10, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile('tests/inspect_19L/all_pencils.jpg');

  console.log('Saved tests/inspect_19L/all_pencils.jpg');
}

makePencilStrip().catch(e => console.error(e));
