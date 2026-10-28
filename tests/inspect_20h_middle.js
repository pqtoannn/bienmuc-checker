import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20H';
const outDir = 'tests/inspect_batch/PL_2020_20H/suspects';

async function check20HMiddle() {
  const pList = [8, 9, 10, 37, 38, 39, 40, 41, 42, 68, 69, 70, 71];
  const crops = [];
  for (const p of pList) {
    const fn = String(p).padStart(3, '0') + '.jpg';
    const buf = await sharp(path.join(dDir, fn)).resize(1200).toBuffer();
    const tr = await sharp(buf).extract({ left: 850, top: 40, width: 330, height: 180 }).toBuffer();
    const tl = await sharp(buf).extract({ left: 40, top: 100, width: 450, height: 200 }).toBuffer();

    const labelSvg = Buffer.from(`
      <svg width="800" height="200">
        <rect width="800" height="200" fill="#fff"/>
        <text x="5" y="30" font-size="24" font-weight="bold" fill="#000">${fn}</text>
      </svg>
    `);

    const c = await sharp({ create: { width: 800, height: 200, channels: 3, background: { r: 240, g: 240, b: 240 } } })
      .composite([
        { input: labelSvg, left: 0, top: 0 },
        { input: tl, left: 100, top: 0 },
        { input: tr, left: 450, top: 0 }
      ])
      .jpeg()
      .toBuffer();
    crops.push(c);
  }

  const cols = 2;
  const rows = Math.ceil(crops.length / cols);
  const comp = crops.map((t, i) => ({
    input: t,
    left: (i % cols) * 810,
    top: Math.floor(i / cols) * 210
  }));

  await sharp({
    create: { width: cols * 810, height: rows * 210, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(comp)
  .jpeg({ quality: 90 })
  .toFile(path.join(outDir, 'middle_zoom.jpg'));

  console.log('Saved middle_zoom.jpg');
}

check20HMiddle();
