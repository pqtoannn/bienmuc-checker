import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const P_DIR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'tests/inspect_batch';

async function makeCollageForDossier(dosName, chunkSize = 16) {
  const dDir = path.join(P_DIR, dosName);
  const outDir = path.join(OUT_DIR, dosName);
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(dDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} photos for ${dosName}...`);

  for (let c = 0; c < Math.ceil(files.length / chunkSize); c++) {
    const chunk = files.slice(c * chunkSize, (c + 1) * chunkSize);
    const tileImages = [];

    for (let idx = 0; idx < chunk.length; idx++) {
      const fn = chunk[idx];
      const src = path.join(dDir, fn);
      const meta = await sharp(src).metadata();

      const trBuf = await sharp(src)
        .extract({
          left: Math.floor(meta.width * 0.72),
          top: Math.floor(meta.height * 0.02),
          width: Math.floor(meta.width * 0.27),
          height: Math.floor(meta.height * 0.20)
        })
        .resize(320, 150, { fit: 'fill' })
        .toBuffer();

      const labelSvg = Buffer.from(`
        <svg width="320" height="150">
          <rect x="0" y="0" width="60" height="24" fill="#000000" opacity="0.8" />
          <text x="6" y="18" font-size="16" font-family="sans-serif" font-weight="bold" fill="#00ffcc">${fn.replace('.jpg','')}</text>
        </svg>
      `);

      const labeledTile = await sharp(trBuf)
        .composite([{ input: labelSvg, left: 0, top: 0 }])
        .toBuffer();

      tileImages.push(labeledTile);
    }

    const cols = 4;
    const rows = Math.ceil(chunk.length / cols);
    const composites = tileImages.map((tile, i) => ({
      input: tile,
      left: (i % cols) * 320,
      top: Math.floor(i / cols) * 150
    }));

    await sharp({
      create: {
        width: cols * 320,
        height: rows * 150,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(path.join(outDir, `tr_collage_${c + 1}.jpg`));
  }

  // Header collage
  for (let c = 0; c < Math.ceil(files.length / chunkSize); c++) {
    const chunk = files.slice(c * chunkSize, (c + 1) * chunkSize);
    const tileImages = [];

    for (let idx = 0; idx < chunk.length; idx++) {
      const fn = chunk[idx];
      const src = path.join(dDir, fn);
      const meta = await sharp(src).metadata();

      const hdBuf = await sharp(src)
        .extract({
          left: Math.floor(meta.width * 0.05),
          top: Math.floor(meta.height * 0.04),
          width: Math.floor(meta.width * 0.65),
          height: Math.floor(meta.height * 0.22)
        })
        .resize(320, 150, { fit: 'fill' })
        .toBuffer();

      const labelSvg = Buffer.from(`
        <svg width="320" height="150">
          <rect x="0" y="0" width="60" height="24" fill="#000000" opacity="0.8" />
          <text x="6" y="18" font-size="16" font-family="sans-serif" font-weight="bold" fill="#ffcc00">${fn.replace('.jpg','')}</text>
        </svg>
      `);

      const labeledTile = await sharp(hdBuf)
        .composite([{ input: labelSvg, left: 0, top: 0 }])
        .toBuffer();

      tileImages.push(labeledTile);
    }

    const cols = 4;
    const rows = Math.ceil(chunk.length / cols);
    const composites = tileImages.map((tile, i) => ({
      input: tile,
      left: (i % cols) * 320,
      top: Math.floor(i / cols) * 150
    }));

    await sharp({
      create: {
        width: cols * 320,
        height: rows * 150,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(path.join(outDir, `hd_collage_${c + 1}.jpg`));
  }

  // Cover 001.jpg and last photo
  const c001 = path.join(dDir, '001.jpg');
  if (fs.existsSync(c001)) {
    await sharp(c001).resize(900).toFile(path.join(outDir, 'full_001.jpg'));
  }
  const lastFn = files[files.length - 1];
  await sharp(path.join(dDir, lastFn)).resize(900).toFile(path.join(outDir, `full_${lastFn}`));
  console.log(`Done collages for ${dosName}`);
}

async function main() {
  await makeCollageForDossier('PL_2020_20G');
  await makeCollageForDossier('PL_2020_20H');
}

main();
