import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function check15J() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15J';
  const outDir = 'tests/inspect_batch2015_1/15J';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  const files = fs.readdirSync(pPhotos).filter(f => f.endsWith('.jpg')).sort();
  const W = 350, H = 200;
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const b = await sharp(path.join(pPhotos, f)).resize(W, H).toBuffer();
    composites.push({ input: b, left: (i % 4) * W, top: Math.floor(i / 4) * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: (i % 4) * W, top: Math.floor(i / 4) * (H + 20) });
  }
  await sharp({ create: { width: W * 4, height: Math.ceil(files.length / 4) * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites).jpeg().toFile('tests/inspect_batch2015_1/grid_15J.jpg');
  console.log('Saved grid_15J.jpg');
}
check15J();
