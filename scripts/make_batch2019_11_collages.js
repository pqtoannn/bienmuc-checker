import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeBatch11Collages() {
  // 1. PL_2019_19X (5 photos)
  {
    const dossier = 'PL_2019_19X';
    const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${dossier}`;
    const outDir = `tests/inspect_batch2019_11/19X`;
    fs.mkdirSync(outDir, { recursive: true });

    const files = fs.readdirSync(photoDir).filter(f => f.toLowerCase().endsWith('.jpg')).sort();
    console.log(`Processing ${files.length} photos for ${dossier}...`);

    for (const fn of files) {
      const p = path.join(photoDir, fn);
      await sharp(p).resize(1200).toFile(path.join(outDir, fn.replace('.jpg', '_view.jpg')));
    }
    console.log('Saved 19X views');
  }

  // 2. PL_2019_19W (79 photos)
  {
    const dossier = 'PL_2019_19W';
    const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${dossier}`;
    const outDir = `tests/inspect_batch2019_11/19W`;
    fs.mkdirSync(outDir, { recursive: true });

    // Save first 3 views to check cover
    for (let i = 1; i <= 3; i++) {
      const fnStr = String(i).padStart(3, '0');
      const p = path.join(photoDir, `${fnStr}.jpg`);
      await sharp(p).resize(1200).toFile(path.join(outDir, `${fnStr}_view.jpg`));
    }

    // Save pencil crops and grid for all 79 photos
    const cardW = 300;
    const cardH = 110;
    const cards = [];

    for (let i = 1; i <= 79; i++) {
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

    // Split into 5 pencil grids (16 per grid)
    const makeGridFile = async (sliceCards, outName) => {
      const cols = 4;
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

    const chunkSize = 16;
    for (let c = 0; c < Math.ceil(cards.length / chunkSize); c++) {
      const chunk = cards.slice(c * chunkSize, (c + 1) * chunkSize);
      await makeGridFile(chunk, `pencils_part${c + 1}.jpg`);
    }

    console.log('Saved 19W pencil grids (Parts 1-5)');
  }
}

makeBatch11Collages().catch(console.error);
