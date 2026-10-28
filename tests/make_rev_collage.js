import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dir = 'tests/inspect_batch/PL_2020_20D/check_rev';
const out = 'tests/inspect_batch/PL_2020_20D/collage_rev.jpg';

async function makeRevCollage() {
  const list = [205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225];
  const composites = [];
  const cols = 4;
  for (let idx = 0; idx < list.length; idx++) {
    const i = list[idx];
    const fn = `tr_${String(i).padStart(3, '0')}.jpg`;
    const col = idx % cols;
    const row = Math.floor(idx / cols);

    const labelSvg = Buffer.from(`
      <svg width="250" height="120">
        <rect x="0" y="0" width="50" height="24" fill="#000000" opacity="0.8" />
        <text x="5" y="18" font-size="16" font-family="sans-serif" font-weight="bold" fill="#00ffcc">${i}</text>
      </svg>
    `);

    const imgBuf = await sharp(path.join(dir, fn))
      .resize(250, 120, { fit: 'fill' })
      .composite([{ input: labelSvg, left: 0, top: 0 }])
      .toBuffer();

    composites.push({
      input: imgBuf,
      left: col * 250,
      top: row * 120
    });
  }

  await sharp({
    create: {
      width: cols * 250,
      height: 6 * 120,
      channels: 3,
      background: { r: 50, g: 50, b: 50 }
    }
  })
    .composite(composites)
    .toFile(out);

  console.log('Saved collage_rev.jpg');
}

makeRevCollage();
