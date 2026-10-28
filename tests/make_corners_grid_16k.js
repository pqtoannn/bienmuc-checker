import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const cDir = 'tests/inspect_batch2016_3/PL_2016_16K_corners';
  const files = fs.readdirSync(cDir).filter(f => f.endsWith('.jpg')).sort();
  console.log('Files 16K:', files.length);

  async function makeGrid(chunk, outFile) {
    const W = 250, H = 150;
    const cols = 5;
    const rows = Math.ceil(chunk.length / cols);
    const canvas = sharp({
      create: { width: cols * W, height: rows * (H + 25), channels: 3, background: { r: 30, g: 30, b: 30 } }
    });
    const composites = [];
    for (let i = 0; i < chunk.length; i++) {
      const f = chunk[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const imgBuf = await sharp(path.join(cDir, f)).resize(W, H).toBuffer();
      composites.push({ input: imgBuf, left: col * W, top: row * (H + 25) + 25 });
      const svg = Buffer.from(`<svg width="${W}" height="25"><text x="10" y="18" font-size="16" fill="yellow" font-family="sans-serif">${f}</text></svg>`);
      composites.push({ input: svg, left: col * W, top: row * (H + 25) });
    }
    await canvas.composite(composites).jpeg({quality: 85}).toFile(outFile);
    console.log('Saved', outFile);
  }

  // 91 files: 3 parts (30, 30, 31)
  await makeGrid(files.slice(0, 30), 'tests/inspect_batch2016_3/16K_corners_p1.jpg');
  await makeGrid(files.slice(30, 60), 'tests/inspect_batch2016_3/16K_corners_p2.jpg');
  await makeGrid(files.slice(60), 'tests/inspect_batch2016_3/16K_corners_p3.jpg');
}
main();
