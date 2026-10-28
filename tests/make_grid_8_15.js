import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dir = 'tests/inspect_batch/PL_2020_20D';
const list = [8, 9, 10, 11, 12, 13, 14, 15];

async function makeGrid() {
  const bufs = [];
  for (const n of list) {
    const fn = `view_${String(n).padStart(3, '0')}.jpg`;
    // crop top 200px
    const b = await sharp(path.join(dir, fn))
      .extract({ left: 0, top: 0, width: 900, height: 200 })
      .toBuffer();
    bufs.push(b);
  }

  const composites = bufs.map((b, idx) => ({
    input: b,
    left: 0,
    top: idx * 205
  }));

  await sharp({
    create: {
      width: 900,
      height: list.length * 205,
      channels: 3,
      background: { r: 230, g: 230, b: 230 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(dir, 'grid_8_15.jpg'));

  console.log('Saved grid_8_15.jpg');
}
makeGrid();
