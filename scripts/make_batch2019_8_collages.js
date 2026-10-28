import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function checkAndMakeCollage(dossier, count, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${dossier}`;
  
  // check first image metadata
  const firstImg = path.join(photoDir, '001.jpg');
  if (fs.existsSync(firstImg)) {
    const meta = await sharp(firstImg).metadata();
    console.log(`${dossier} 001.jpg metadata: width=${meta.width}, height=${meta.height}`);
  }

  const cellW = 600;
  const cellH = 220;
  const items = [];

  for (let i = 1; i <= count; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = path.join(photoDir, `${fnStr}.jpg`);
    if (!fs.existsSync(fn)) {
      console.log(`Missing ${fn}`);
      continue;
    }

    const meta = await sharp(fn).metadata();
    const W = meta.width;
    const H = meta.height;

    // Crop top-left (header: agency, doc number, title)
    // Left: 5% to 65% width, Top: 3% to 35% height
    const leftCrop = {
      left: Math.round(W * 0.05),
      top: Math.round(H * 0.02),
      width: Math.round(W * 0.60),
      height: Math.round(H * 0.35)
    };

    // Crop top-right (sheet number in pencil usually at top-right)
    const rightCrop = {
      left: Math.round(W * 0.70),
      top: Math.round(H * 0.01),
      width: Math.round(W * 0.28),
      height: Math.round(H * 0.25)
    };

    const leftBuf = await sharp(fn)
      .extract(leftCrop)
      .resize(360, 170, { fit: 'fill' })
      .toBuffer();

    const rightBuf = await sharp(fn)
      .extract(rightCrop)
      .resize(200, 170, { fit: 'fill' })
      .toBuffer();

    const labelSvg = Buffer.from(
      `<svg width="${cellW}" height="35">
        <rect width="${cellW}" height="35" fill="#1e293b"/>
        <text x="15" y="24" font-family="sans-serif" font-size="18" font-weight="bold" fill="#38bdf8">${fnStr}.jpg (${W}x${H})</text>
      </svg>`
    );

    const card = await sharp({
      create: { width: cellW, height: cellH, channels: 3, background: { r: 245, g: 245, b: 245 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: leftBuf, left: 10, top: 40 },
      { input: rightBuf, left: 385, top: 40 }
    ])
    .jpeg()
    .toBuffer();

    items.push(card);
  }

  // Create composite grid (2 columns)
  const cols = 2;
  const rows = Math.ceil(items.length / cols);
  const composites = [];
  for (let idx = 0; idx < items.length; idx++) {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    composites.push({
      input: items[idx],
      left: col * (cellW + 15) + 15,
      top: row * (cellH + 15) + 15
    });
  }

  const outPath = path.join(outDir, `collage_${dossier}_all.jpg`);
  await sharp({
    create: {
      width: cols * (cellW + 15) + 15,
      height: rows * (cellH + 15) + 15,
      channels: 3,
      background: { r: 203, g: 213, b: 225 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(outPath);

  console.log(`Saved collage for ${dossier}: ${outPath} (${items.length} cards)`);
}

async function main() {
  await checkAndMakeCollage('PL_2019_19Q', 5, 'tests/inspect_batch2019_8/19Q');
  await checkAndMakeCollage('PL_2019_19R', 34, 'tests/inspect_batch2019_8/19R');
}

main().catch(console.error);
