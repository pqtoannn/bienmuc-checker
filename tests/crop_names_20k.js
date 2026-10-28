import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20K';
const outDir = 'tests/inspect_batch/PL_2020_20K';

async function cropNames() {
  const tiles = [];
  for (let p = 2; p <= 14; p++) {
    const fn = String(p).padStart(3, '0') + '.jpg';
    const buf = await sharp(path.join(dDir, fn)).resize(1000).toBuffer();
    const body = await sharp(buf).extract({ left: 100, top: 180, width: 800, height: 280 }).toBuffer();

    const labelSvg = Buffer.from(`
      <svg width="150" height="280">
        <rect width="150" height="280" fill="#eee"/>
        <text x="10" y="40" font-size="28" font-weight="bold" fill="#000">${fn}</text>
      </svg>
    `);

    const t = await sharp({ create: { width: 960, height: 280, channels: 3, background: { r: 240, g: 240, b: 240 } } })
      .composite([
        { input: labelSvg, left: 0, top: 0 },
        { input: body, left: 155, top: 0 }
      ])
      .jpeg()
      .toBuffer();

    tiles.push(t);
  }

  const comp = tiles.map((t, i) => ({
    input: t,
    left: 0,
    top: i * 290
  }));

  await sharp({
    create: { width: 960, height: tiles.length * 290, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(comp)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'names_20k.jpg'));

  console.log('Saved names_20k.jpg');
}

cropNames();
