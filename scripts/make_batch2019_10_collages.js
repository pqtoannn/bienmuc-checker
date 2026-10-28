import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeBatch10Collages() {
  // 1. PL_2019_19U (6 photos)
  {
    const dossier = 'PL_2019_19U';
    const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${dossier}`;
    const outDir = `tests/inspect_batch2019_10/19U`;
    fs.mkdirSync(outDir, { recursive: true });

    for (let i = 1; i <= 6; i++) {
      const fnStr = String(i).padStart(3, '0');
      const p = path.join(photoDir, `${fnStr}.jpg`);
      await sharp(p).resize(1200).toFile(path.join(outDir, `${fnStr}_view.jpg`));
    }
    console.log('Saved 19U views (6 photos)');
  }

  // 2. PL_2019_19V (27 photos)
  {
    const dossier = 'PL_2019_19V';
    const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${dossier}`;
    const outDir = `tests/inspect_batch2019_10/19V`;
    fs.mkdirSync(outDir, { recursive: true });

    // Save first 3 views to check cover
    for (let i = 1; i <= 3; i++) {
      const fnStr = String(i).padStart(3, '0');
      const p = path.join(photoDir, `${fnStr}.jpg`);
      await sharp(p).resize(1200).toFile(path.join(outDir, `${fnStr}_view.jpg`));
    }

    // Save pencil crops and grid for all 27 photos
    const cardW = 300;
    const cardH = 110;
    const cards = [];

    for (let i = 1; i <= 27; i++) {
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

    // Split into 2 pencil grids (Part 1: 1-14, Part 2: 15-27)
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

    await makeGridFile(cards.slice(0, 14), 'pencils_part1.jpg');
    await makeGridFile(cards.slice(14), 'pencils_part2.jpg');

    console.log('Saved 19V pencil grids (Part 1, 2)');
  }
}

makeBatch10Collages().catch(console.error);
