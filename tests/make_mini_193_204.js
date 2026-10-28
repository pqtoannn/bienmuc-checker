import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dir = 'tests/inspect_batch/PL_2020_20D/check_193_204';
const out = 'tests/inspect_batch/PL_2020_20D/collage_193_204.jpg';

async function makeMiniCollage() {
  const composites = [];
  const cols = 4;
  for (let i = 193; i <= 204; i++) {
    const fn = `crop_${String(i).padStart(3, '0')}.jpg`;
    const idx = i - 193;
    const col = idx % cols;
    const row = Math.floor(idx / cols);

    const labelSvg = Buffer.from(`
      <svg width="300" height="150">
        <rect x="0" y="0" width="50" height="24" fill="#000000" opacity="0.8" />
        <text x="5" y="18" font-size="16" font-family="sans-serif" font-weight="bold" fill="#00ffcc">${i}</text>
      </svg>
    `);

    const imgBuf = await sharp(path.join(dir, fn))
      .resize(300, 150, { fit: 'fill' })
      .composite([{ input: labelSvg, left: 0, top: 0 }])
      .toBuffer();

    composites.push({
      input: imgBuf,
      left: col * 300,
      top: row * 150
    });
  }

  await sharp({
    create: {
      width: cols * 300,
      height: 3 * 150,
      channels: 3,
      background: { r: 50, g: 50, b: 50 }
    }
  })
    .composite(composites)
    .toFile(out);

  console.log('Saved collage_193_204.jpg');
}

makeMiniCollage();
