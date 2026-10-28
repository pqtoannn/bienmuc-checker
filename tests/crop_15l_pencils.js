import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function crop15LPencils() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15L';
  const outDir = 'tests/inspect_batch2015_3/15L';

  const W = 200, H = 150;
  const cols = 5;
  const count = 20; // 002 to 021
  const rows = Math.ceil(count / cols);
  const canvas = sharp({
    create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
  });
  const composites = [];
  for (let i = 2; i <= 21; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    const idx = i - 2;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const meta = await sharp(path.join(pPhotos, f)).metadata();
    const b = await sharp(path.join(pPhotos, f))
      .extract({
        left: Math.round(meta.width * 0.68),
        top: Math.round(meta.height * 0.08),
        width: Math.round(meta.width * 0.22),
        height: Math.round(meta.height * 0.22)
      })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
    composites.push({ input: svg, left: col * W, top: row * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(outDir, 'pencils_002_021.jpg'));
  console.log('Saved pencils_002_021.jpg');
}
crop15LPencils();
