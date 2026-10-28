import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const outDir = 'tests/inspect_batch/PL_2020_20E';

async function makeGrid() {
  const bufs = [];
  for (let i = 2; i <= 8; i++) {
    const fn = `view_${String(i).padStart(3, '0')}.jpg`;
    const b = await sharp(path.join(outDir, fn))
      .extract({ left: 100, top: 120, width: 750, height: 260 })
      .toBuffer();
    bufs.push(b);
  }

  const composites = bufs.map((b, idx) => ({
    input: b,
    left: 0,
    top: idx * 265
  }));

  await sharp({
    create: {
      width: 750,
      height: bufs.length * 265,
      channels: 3,
      background: { r: 230, g: 230, b: 230 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'grid_20e_titles.jpg'));

  console.log('Saved grid_20e_titles.jpg');
}
makeGrid();
