import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dir = 'tests/inspect_batch/PL_2020_20D/check_192_198';

async function makeGrid() {
  const items = [];
  for (let i = 190; i <= 210; i++) {
    const fn = `${String(i).padStart(3, '0')}.jpg`;
    const tlPath = path.join(dir, `tl_${fn}`);
    const trPath = path.join(dir, `tr_${fn}`);
    
    // Combine tl and tr side-by-side: width 800, height 250
    const tlBuf = await sharp(tlPath).resize({ width: 500, height: 250, fit: 'inside' }).toBuffer();
    const trBuf = await sharp(trPath).resize({ width: 300, height: 250, fit: 'inside' }).toBuffer();
    
    const combined = await sharp({
      create: {
        width: 820,
        height: 260,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    })
    .composite([
      { input: tlBuf, left: 10, top: 5 },
      { input: trBuf, left: 520, top: 5 }
    ])
    .png()
    .toBuffer();

    items.push({ i, fn, buf: combined });
  }

  // Group into 2 images: 190-200 and 201-210
  for (let part = 0; part < 2; part++) {
    const subset = items.slice(part * 10, (part + 1) * 10 + 1);
    const totalHeight = subset.length * 270 + 20;
    const composites = subset.map((item, idx) => ({
      input: item.buf,
      left: 10,
      top: 10 + idx * 270
    }));

    await sharp({
      create: {
        width: 840,
        height: totalHeight,
        channels: 3,
        background: { r: 200, g: 200, b: 200 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(path.join(dir, `grid_part_${part + 1}.jpg`));
  }

  console.log('Created grid_part_1.jpg and grid_part_2.jpg');
}
makeGrid();
