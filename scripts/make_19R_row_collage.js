import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeRowCollage() {
  const dir = 'tests/inspect_batch2019_8/19R_details';
  const outDir = 'tests/inspect_batch2019_8';
  
  const rowW = 1200;
  const rowH = 150;
  const rows = [];

  for (let i = 1; i <= 34; i++) {
    const fnStr = String(i).padStart(3, '0');
    const headerP = path.join(dir, `${fnStr}_header.jpg`);
    const pencilP = path.join(dir, `${fnStr}_pencil.jpg`);
    const footerP = path.join(dir, `${fnStr}_footer.jpg`);

    if (!fs.existsSync(headerP) || !fs.existsSync(pencilP)) continue;

    const labelSvg = Buffer.from(
      `<svg width="100" height="${rowH}">
        <rect width="100" height="${rowH}" fill="#0f172a"/>
        <text x="50" y="80" font-family="sans-serif" font-size="22" font-weight="bold" fill="#38bdf8" text-anchor="middle">${fnStr}.jpg</text>
      </svg>`
    );

    const headerBuf = await sharp(headerP)
      .resize(500, rowH - 10, { fit: 'fill' })
      .toBuffer();

    const pencilBuf = await sharp(pencilP)
      .resize(280, rowH - 10, { fit: 'fill' })
      .toBuffer();

    const footerBuf = await sharp(footerP)
      .resize(300, rowH - 10, { fit: 'fill' })
      .toBuffer();

    const rowCard = await sharp({
      create: { width: rowW, height: rowH, channels: 3, background: { r: 240, g: 240, b: 240 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: headerBuf, left: 105, top: 5 },
      { input: pencilBuf, left: 610, top: 5 },
      { input: footerBuf, left: 895, top: 5 }
    ])
    .jpeg()
    .toBuffer();

    rows.push(rowCard);
  }

  // Split into 2 collage images: Part 1 (1-17) and Part 2 (18-34)
  const part1Composites = rows.slice(0, 17).map((card, idx) => ({
    input: card,
    left: 0,
    top: idx * (rowH + 4)
  }));

  await sharp({
    create: {
      width: rowW,
      height: 17 * (rowH + 4),
      channels: 3,
      background: { r: 100, g: 116, b: 139 }
    }
  })
  .composite(part1Composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'collage_19R_rows_part1.jpg'));

  const part2Composites = rows.slice(17).map((card, idx) => ({
    input: card,
    left: 0,
    top: idx * (rowH + 4)
  }));

  await sharp({
    create: {
      width: rowW,
      height: (rows.length - 17) * (rowH + 4),
      channels: 3,
      background: { r: 100, g: 116, b: 139 }
    }
  })
  .composite(part2Composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'collage_19R_rows_part2.jpg'));

  console.log('Saved 19R row collages part1 and part2!');
}

makeRowCollage().catch(console.error);
