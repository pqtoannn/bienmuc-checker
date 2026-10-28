import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const outDir = 'tests/inspect_batch/PL_2020_20D';

async function makeCollagesD() {
  const files = fs.readdirSync(dDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} files in 20D...`);

  const chunkSize = 16;
  for (let c = 0; c < Math.ceil(files.length / chunkSize); c++) {
    const chunk = files.slice(c * chunkSize, (c + 1) * chunkSize);
    const tileImages = [];

    for (let idx = 0; idx < chunk.length; idx++) {
      const fn = chunk[idx];
      const src = path.join(dDir, fn);
      const meta = await sharp(src).metadata();

      const cropBuf = await sharp(src)
        .extract({
          left: Math.floor(meta.width * 0.75),
          top: Math.floor(meta.height * 0.12),
          width: Math.floor(meta.width * 0.24),
          height: Math.floor(meta.height * 0.22)
        })
        .resize(300, 150, { fit: 'fill' })
        .toBuffer();

      const labelSvg = Buffer.from(`
        <svg width="300" height="150">
          <rect x="0" y="0" width="60" height="24" fill="#000000" opacity="0.8" />
          <text x="6" y="18" font-size="16" font-family="sans-serif" font-weight="bold" fill="#00ffcc">${fn.replace('.jpg','')}</text>
        </svg>
      `);

      const labeledTile = await sharp(cropBuf)
        .composite([{ input: labelSvg, left: 0, top: 0 }])
        .toBuffer();

      tileImages.push(labeledTile);
    }

    const cols = 4;
    const rows = Math.ceil(chunk.length / cols);
    const canvasWidth = cols * 300;
    const canvasHeight = rows * 150;

    const composites = [];
    for (let i = 0; i < tileImages.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      composites.push({
        input: tileImages[i],
        left: col * 300,
        top: row * 150
      });
    }

    await sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 3,
        background: { r: 50, g: 50, b: 50 }
      }
    })
      .composite(composites)
      .toFile(path.join(outDir, `tr_new_collage_${c + 1}.jpg`));

    console.log(`Saved tr_new_collage_${c + 1}.jpg`);
  }
}

makeCollagesD().catch(console.error);
