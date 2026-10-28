import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';

async function cropTR(n) {
  const fn = `${String(n).padStart(3, '0')}.jpg`;
  const viewBuf = await sharp(path.join(dDir, fn)).resize(900).toBuffer();
  return sharp(viewBuf)
    .extract({ left: 650, top: 40, width: 240, height: 120 })
    .toBuffer();
}

async function run() {
  const list = [170, 171, 172, 173, 174, 175, 176];
  const bufs = [];
  for (const n of list) {
    const b = await cropTR(n);
    const labelSvg = Buffer.from(`
      <svg width="240" height="120">
        <rect x="0" y="0" width="50" height="24" fill="#000" opacity="0.8"/>
        <text x="5" y="18" font-size="16" fill="#0ff" font-family="sans-serif">${n}</text>
      </svg>
    `);
    bufs.push(await sharp(b).composite([{ input: labelSvg, left: 0, top: 0 }]).toBuffer());
  }
  const cols = 2;
  const rows = Math.ceil(list.length / cols);
  const composites = bufs.map((b, idx) => ({
    input: b,
    left: (idx % cols) * 245,
    top: Math.floor(idx / cols) * 125
  }));
  await sharp({
    create: { width: cols * 245, height: rows * 125, channels: 3, background: { r: 200, g: 200, b: 200 } }
  }).composite(composites).jpeg({ quality: 85 }).toFile('tests/inspect_batch/PL_2020_20D/grid_170_176.jpg');
  console.log('Saved grid_170_176.jpg');
}
run();
