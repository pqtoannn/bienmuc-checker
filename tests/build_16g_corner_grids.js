import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeGrid(files, outName, label) {
  const inDir = 'tests/inspect_batch2016_5/16G';
  const W = 280, H = 160;
  const cols = 5;
  const rows = Math.ceil(files.length / cols);
  const canvas = sharp({
    create: { width: cols * W, height: rows * (H + 25), channels: 3, background: { r: 30, g: 30, b: 30 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const imgBuf = await sharp(path.join(inDir, 'corner_' + f)).resize(W, H).toBuffer();
    composites.push({ input: imgBuf, left: col * W, top: row * (H + 25) + 25 });
    const svg = Buffer.from(`<svg width="${W}" height="25"><text x="10" y="18" font-size="16" fill="yellow" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: col * W, top: row * (H + 25) });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile('tests/inspect_batch2016_5/' + outName);
  console.log(`Saved tests/inspect_batch2016_5/${outName}`);
}

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const allFiles = fs.readdirSync(pDir).filter(f => f.endsWith('.jpg')).sort();

  // Split into 4 parts: 1-40, 41-80, 81-120, 121-164
  await makeGrid(allFiles.slice(0, 40), '16G_corners_part1.jpg', '1-40');
  await makeGrid(allFiles.slice(40, 80), '16G_corners_part2.jpg', '41-80');
  await makeGrid(allFiles.slice(80, 120), '16G_corners_part3.jpg', '81-120');
  await makeGrid(allFiles.slice(120), '16G_corners_part4.jpg', '121-164');
}
main();
