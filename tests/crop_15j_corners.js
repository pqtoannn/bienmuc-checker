import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function crop15JCorners() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15J';
  const outDir = 'tests/inspect_batch2015_1/15J';
  const list = ['004.jpg', '005.jpg', '006.jpg', '007.jpg', '008.jpg', '009.jpg', '010.jpg', '011.jpg', '012.jpg', '013.jpg', '014.jpg'];
  const composites = [];
  const W = 250, H = 150;
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    const meta = await sharp(path.join(pPhotos, f)).metadata();
    const b = await sharp(path.join(pPhotos, f))
      .extract({
        left: Math.round(meta.width * 0.75),
        top: Math.round(meta.height * 0.03),
        width: Math.round(meta.width * 0.23),
        height: Math.round(meta.height * 0.15)
      })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: b, left: (i % 3) * W, top: Math.floor(i / 3) * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: (i % 3) * W, top: Math.floor(i / 3) * (H + 20) });
  }
  await sharp({ create: { width: W * 3, height: Math.ceil(list.length / 3) * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites).jpeg().toFile('tests/inspect_batch2015_1/corners_15J.jpg');
  console.log('Saved corners_15J.jpg');
}
crop15JCorners();
