import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19A/dates';

async function main() {
  const nums = ['005', '029', '076', '077', '079', '105', '167', '179', '186', '191', '192', '194', '199', '205', '206', '210', '211', '214'];
  const items = [];
  
  for (const n of nums) {
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19A/${n}.jpg`;
    const imgBuf = await sharp(fn)
      .extract({ left: 850, top: 170, width: 750, height: 160 })
      .resize(350, 80, { fit: 'fill' })
      .toBuffer();
    const labelSvg = Buffer.from(
      `<svg width="60" height="80"><rect width="60" height="80" fill="#222"/><text x="10" y="45" font-family="sans-serif" font-size="16" font-weight="bold" fill="#00ffcc">${n}</text></svg>`
    );
    const card = await sharp({
      create: { width: 420, height: 80, channels: 3, background: { r: 240, g: 240, b: 240 } }
    })
    .composite([{ input: labelSvg, left: 0, top: 0 }, { input: imgBuf, left: 65, top: 0 }])
    .jpeg().toBuffer();
    items.push(card);
  }

  const cols = 2;
  const rows = Math.ceil(items.length / cols);
  const composites = [];
  for (let i = 0; i < items.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    composites.push({ input: items[i], left: c * 430 + 10, top: r * 90 + 10 });
  }

  await sharp({
    create: { width: cols * 430 + 10, height: rows * 90 + 10, channels: 3, background: { r: 200, g: 200, b: 200 } }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(path.join(outDir, 'missing_dates_corrected.jpg'));

  console.log('Saved missing_dates_corrected.jpg');
}

main().catch(console.error);
