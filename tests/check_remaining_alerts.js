import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const outDir = 'tests/inspect_batch/PL_2020_20D/check_16_40';

async function makeGrid() {
  const nums = [76, 77, 78, 87, 88, 89, 104, 105, 106, 109, 110, 111, 128, 129, 130, 133, 134, 135, 177, 178, 179, 180, 181, 182];
  const bufs = [];
  for (const n of nums) {
    const fn = `${String(n).padStart(3, '0')}.jpg`;
    const viewBuf = await sharp(path.join(dDir, fn)).resize(900).toBuffer();
    const crop = await sharp(viewBuf)
      .extract({ left: 650, top: 40, width: 240, height: 120 })
      .toBuffer();

    const labelSvg = Buffer.from(`
      <svg width="240" height="120">
        <rect x="0" y="0" width="50" height="24" fill="#000" opacity="0.8"/>
        <text x="5" y="18" font-size="16" fill="#0ff" font-family="sans-serif">${n}</text>
      </svg>
    `);
    const labeled = await sharp(crop).composite([{ input: labelSvg, left: 0, top: 0 }]).toBuffer();
    bufs.push(labeled);
  }

  const cols = 3;
  const rows = Math.ceil(nums.length / cols);
  const composites = bufs.map((b, idx) => ({
    input: b,
    left: (idx % cols) * 245,
    top: Math.floor(idx / cols) * 125
  }));

  await sharp({
    create: {
      width: cols * 245,
      height: rows * 125,
      channels: 3,
      background: { r: 200, g: 200, b: 200 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'grid_remaining_alerts.jpg'));

  console.log('Saved grid_remaining_alerts.jpg');
}
makeGrid();
