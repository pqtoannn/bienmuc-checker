import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20G';
const outDir = 'tests/inspect_batch/PL_2020_20G/suspects';

async function checkDetails() {
  const pList = [24, 25, 26, 27, 28, 47, 48, 49, 73, 74, 75, 76];
  const crops = [];
  for (const p of pList) {
    const fn = String(p).padStart(3, '0') + '.jpg';
    const buf = await sharp(path.join(dDir, fn)).resize(1200).toBuffer();
    const tr = await sharp(buf).extract({ left: 880, top: 40, width: 300, height: 180 }).toBuffer();
    const tl = await sharp(buf).extract({ left: 50, top: 120, width: 400, height: 180 }).toBuffer();

    const labelSvg = Buffer.from(`
      <svg width="720" height="180">
        <rect width="720" height="180" fill="#fff"/>
        <text x="5" y="30" font-size="24" font-weight="bold" fill="#000">${fn}</text>
      </svg>
    `);

    const c = await sharp({ create: { width: 720, height: 180, channels: 3, background: { r: 240, g: 240, b: 240 } } })
      .composite([
        { input: labelSvg, left: 0, top: 0 },
        { input: tl, left: 100, top: 0 },
        { input: tr, left: 420, top: 0 }
      ])
      .jpeg()
      .toBuffer();
    crops.push(c);
  }

  const cols = 2;
  const rows = Math.ceil(crops.length / cols);
  const comp = crops.map((t, i) => ({
    input: t,
    left: (i % cols) * 725,
    top: Math.floor(i / cols) * 185
  }));

  await sharp({
    create: { width: cols * 725, height: rows * 185, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(comp)
  .jpeg({ quality: 90 })
  .toFile(path.join(outDir, 'details_zoom.jpg'));

  console.log('Saved details_zoom.jpg');
}

checkDetails();
