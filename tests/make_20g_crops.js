import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20G';
const outDir = 'tests/inspect_batch/PL_2020_20G/crops_hd';
fs.mkdirSync(outDir, { recursive: true });

async function makeGridCrops() {
  const files = fs.readdirSync(dDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} files in 20G...`);

  const chunkSize = 16;
  for (let c = 0; c < Math.ceil(files.length / chunkSize); c++) {
    const chunk = files.slice(c * chunkSize, (c + 1) * chunkSize);
    const tileImages = [];

    for (let idx = 0; idx < chunk.length; idx++) {
      const fn = chunk[idx];
      const src = path.join(dDir, fn);
      const viewBuf = await sharp(src).resize(900).toBuffer();

      const cropBuf = await sharp(viewBuf)
        .extract({ left: 700, top: 60, width: 195, height: 160 })
        .toBuffer();

      const labelSvg = Buffer.from(`
        <svg width="195" height="160">
          <rect x="0" y="0" width="55" height="24" fill="#000" opacity="0.8"/>
          <text x="5" y="18" font-size="16" fill="#0ff" font-family="sans-serif">${fn.replace('.jpg','')}</text>
        </svg>
      `);

      const labeledTile = await sharp(cropBuf)
        .composite([{ input: labelSvg, left: 0, top: 0 }])
        .toBuffer();

      tileImages.push(labeledTile);
    }

    const cols = 4;
    const rows = Math.ceil(chunk.length / cols);
    const composites = tileImages.map((tile, i) => ({
      input: tile,
      left: (i % cols) * 200,
      top: Math.floor(i / cols) * 165
    }));

    await sharp({
      create: {
        width: cols * 200,
        height: rows * 165,
        channels: 3,
        background: { r: 220, g: 220, b: 220 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(path.join(outDir, `grid_${c + 1}.jpg`));
  }

  console.log('Saved all grid crops for 20G');
}
makeGridCrops();
