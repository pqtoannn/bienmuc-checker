import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function cropPencils21_72() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15C';
  const outDir = 'tests/inspect_batch2015_2/15C';

  async function makeCollage(startIdx, endIdx, outName) {
    const W = 150, H = 150;
    const cols = 6;
    const count = endIdx - startIdx + 1;
    const rows = Math.ceil(count / cols);
    const canvas = sharp({
      create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
    });
    const composites = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const f = String(i).padStart(3, '0') + '.jpg';
      const idx = i - startIdx;
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const meta = await sharp(path.join(pPhotos, f)).metadata();
      const b = await sharp(path.join(pPhotos, f))
        .extract({
          left: Math.round(meta.width * 0.88),
          top: Math.round(meta.height * 0.08),
          width: Math.round(meta.width * 0.11),
          height: Math.round(meta.height * 0.22)
        })
        .resize(W, H)
        .toBuffer();
      composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
      const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
      composites.push({ input: svg, left: col * W, top: row * (H + 20) });
    }
    await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(outDir, outName));
    console.log('Saved ' + outName);
  }

  await makeCollage(21, 46, 'pencils_021_046.jpg');
  await makeCollage(47, 72, 'pencils_047_072.jpg');
}
cropPencils21_72();
