import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20I';
const outDir = 'tests/inspect_batch/PL_2020_20I/grids';
fs.mkdirSync(outDir, { recursive: true });

async function make20IGrids() {
  const files = fs.readdirSync(dDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} files in 20I...`);

  const chunkSize = 16;
  for (let c = 0; c < Math.ceil(files.length / chunkSize); c++) {
    const chunk = files.slice(c * chunkSize, (c + 1) * chunkSize);
    const tileImages = [];

    for (let idx = 0; idx < chunk.length; idx++) {
      const fn = chunk[idx];
      const src = path.join(dDir, fn);
      const viewBuf = await sharp(src).resize(1000).toBuffer();

      const cropBuf = await sharp(viewBuf)
        .extract({ left: 750, top: 40, width: 240, height: 160 })
        .toBuffer();

      const tlBuf = await sharp(viewBuf)
        .extract({ left: 40, top: 100, width: 350, height: 160 })
        .toBuffer();

      const labelSvg = Buffer.from(`
        <svg width="600" height="160">
          <rect width="600" height="160" fill="#fff"/>
          <text x="5" y="25" font-size="20" font-weight="bold" fill="#000">${fn.replace('.jpg','')}</text>
        </svg>
      `);

      const labeledTile = await sharp({
        create: { width: 620, height: 170, channels: 3, background: { r: 230, g: 230, b: 230 } }
      })
      .composite([
        { input: labelSvg, left: 5, top: 5 },
        { input: tlBuf, left: 60, top: 5 },
        { input: cropBuf, left: 375, top: 5 }
      ])
      .jpeg()
      .toBuffer();

      tileImages.push(labeledTile);
    }

    const cols = 2;
    const rows = Math.ceil(chunk.length / cols);
    const composites = tileImages.map((tile, i) => ({
      input: tile,
      left: (i % cols) * 625,
      top: Math.floor(i / cols) * 175
    }));

    await sharp({
      create: {
        width: cols * 625,
        height: rows * 175,
        channels: 3,
        background: { r: 200, g: 200, b: 200 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(path.join(outDir, `grid_${c + 1}.jpg`));
  }

  console.log('Saved all grid crops for 20I');
}

make20IGrids();
