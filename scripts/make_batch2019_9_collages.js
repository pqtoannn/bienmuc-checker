import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeBatch9Collages() {
  // 1. PL_2019_19T (5 photos)
  {
    const dossier = 'PL_2019_19T';
    const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${dossier}`;
    const outDir = `tests/inspect_batch2019_9/19T`;
    fs.mkdirSync(outDir, { recursive: true });

    for (let i = 1; i <= 5; i++) {
      const fnStr = String(i).padStart(3, '0');
      const p = path.join(photoDir, `${fnStr}.jpg`);
      await sharp(p).resize(1200).toFile(path.join(outDir, `${fnStr}_view.jpg`));
    }
    console.log('Saved 19T views (5 photos)');
  }

  // 2. PL_2019_19S (56 photos)
  {
    const dossier = 'PL_2019_19S';
    const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${dossier}`;
    const outDir = `tests/inspect_batch2019_9/19S`;
    fs.mkdirSync(outDir, { recursive: true });

    // Save first 3 views to check cover
    for (let i = 1; i <= 3; i++) {
      const fnStr = String(i).padStart(3, '0');
      const p = path.join(photoDir, `${fnStr}.jpg`);
      await sharp(p).resize(1200).toFile(path.join(outDir, `${fnStr}_view.jpg`));
    }

    // Generate pencil grid for all 56 photos
    const cardW = 300;
    const cardH = 110;
    const cards = [];

    for (let i = 1; i <= 56; i++) {
      const fnStr = String(i).padStart(3, '0');
      const p = path.join(photoDir, `${fnStr}.jpg`);
      if (!fs.existsSync(p)) continue;

      const meta = await sharp(p).metadata();
      const W = meta.width;
      const H = meta.height;

      const pBuf = await sharp(p)
        .extract({
          left: Math.round(W * 0.70),
          top: Math.round(H * 0.01),
          width: Math.round(W * 0.28),
          height: Math.round(H * 0.20)
        })
        .resize(200, 100, { fit: 'inside' })
        .toBuffer();

      const pMeta = await sharp(pBuf).metadata();

      const labelSvg = Buffer.from(
        `<svg width="90" height="${cardH}">
          <rect width="90" height="${cardH}" fill="#0f172a"/>
          <text x="45" y="60" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">${fnStr}.jpg</text>
        </svg>`
      );

      const card = await sharp({
        create: { width: cardW, height: cardH, channels: 3, background: { r: 245, g: 245, b: 245 } }
      })
      .composite([
        { input: labelSvg, left: 0, top: 0 },
        { input: pBuf, left: 95, top: Math.max(0, Math.floor((cardH - pMeta.height) / 2)) }
      ])
      .jpeg()
      .toBuffer();

      cards.push(card);
    }

    // Split into 3 pencil grids (Part A: 1-19, Part B: 20-38, Part C: 39-56)
    const makeGridFile = async (sliceCards, outName) => {
      const cols = 3;
      const rows = Math.ceil(sliceCards.length / cols);
      const composites = [];
      for (let idx = 0; idx < sliceCards.length; idx++) {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        composites.push({
          input: sliceCards[idx],
          left: c * 310 + 10,
          top: r * 120 + 10
        });
      }

      await sharp({
        create: {
          width: cols * 310 + 10,
          height: rows * 120 + 10,
          channels: 3,
          background: { r: 203, g: 213, b: 225 }
        }
      })
      .composite(composites)
      .jpeg({ quality: 90 })
      .toFile(path.join(outDir, outName));
    };

    await makeGridFile(cards.slice(0, 19), 'pencils_partA.jpg');
    await makeGridFile(cards.slice(19, 38), 'pencils_partB.jpg');
    await makeGridFile(cards.slice(38), 'pencils_partC.jpg');

    console.log('Saved 19S pencil grids (Part A, B, C)');
  }
}

makeBatch9Collages().catch(console.error);
