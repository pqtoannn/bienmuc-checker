import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function cropEarly15C() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15C';
  const outDir = 'tests/inspect_batch2015_2/15C';
  const files = ['002.jpg','003.jpg','004.jpg','005.jpg','006.jpg','007.jpg','008.jpg','009.jpg','010.jpg','011.jpg','012.jpg','013.jpg','014.jpg','015.jpg'];

  const W = 280, H = 220;
  const cols = 4;
  const rows = Math.ceil(files.length / cols);
  const canvas = sharp({
    create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const meta = await sharp(path.join(pPhotos, f)).metadata();
    const b = await sharp(path.join(pPhotos, f))
      .extract({
        left: Math.round(meta.width * 0.65),
        top: Math.round(meta.height * 0.01),
        width: Math.round(meta.width * 0.34),
        height: Math.round(meta.height * 0.28)
      })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
    composites.push({ input: svg, left: col * W, top: row * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(outDir, 'corners_15C_002_015.jpg'));
  console.log('Saved corners_15C_002_015.jpg');
}

cropEarly15C();
