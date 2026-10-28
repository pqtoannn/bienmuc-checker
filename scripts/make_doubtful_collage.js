import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const nums = [14, 15, 16, 22, 23, 24, 34, 35, 53, 54, 55, 88];
  const items = [];
  for (const n of nums) {
    const fnStr = String(n).padStart(3, '0');
    const imgBuf = await sharp('tests/inspect_19B/doubtful/' + fnStr + '_tr_wide.jpg')
      .resize(360, 140, { fit: 'fill' })
      .toBuffer();
    const labelSvg = Buffer.from(
      `<svg width="60" height="140"><rect width="60" height="140" fill="#111"/><text x="5" y="75" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffcc00">${fnStr}</text></svg>`
    );
    const card = await sharp({
      create: { width: 420, height: 140, channels: 3, background: { r: 230, g: 230, b: 230 } }
    })
    .composite([{ input: labelSvg, left: 0, top: 0 }, { input: imgBuf, left: 60, top: 0 }])
    .jpeg().toBuffer();
    items.push(card);
  }

  // 4 rows x 3 cols
  const cols = 3;
  const rows = 4;
  const composites = [];
  for (let i = 0; i < items.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    composites.push({ input: items[i], left: c * 430 + 10, top: r * 150 + 10 });
  }

  await sharp({
    create: { width: cols * 430 + 10, height: rows * 150 + 10, channels: 3, background: { r: 180, g: 180, b: 180 } }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile('tests/inspect_19B/doubtful/doubtful_collage.jpg');

  console.log('Saved doubtful_collage.jpg');
}

main().catch(console.error);
