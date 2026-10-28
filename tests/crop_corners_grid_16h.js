import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16H';
  const outDir = 'tests/inspect_batch2016_4/PL_2016_16H_corners';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  const files = fs.readdirSync(pDir).filter(f => f.endsWith('.jpg')).sort();
  for (const f of files) {
    if (f === '001.jpg') continue;
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.76),
        top: Math.round(meta.height * 0.18),
        width: Math.round(meta.width * 0.22),
        height: Math.round(meta.height * 0.15)
      })
      .resize({width: 250})
      .toFile(outDir + '/' + f);
  }
  console.log('Done corners 16H');

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
      const imgBuf = await sharp(path.join(outDir, f)).resize(W, H).toBuffer();
      composites.push({ input: imgBuf, left: col * W, top: row * (H + 25) + 25 });
      const svg = Buffer.from(`<svg width="${W}" height="25"><text x="10" y="18" font-size="16" fill="yellow" font-family="sans-serif">${f}</text></svg>`);
      composites.push({ input: svg, left: col * W, top: row * (H + 25) });
    }
    await canvas.composite(composites).jpeg({quality: 85}).toFile(outFile);
    console.log('Saved', outFile);
  }

  const cFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg')).sort();
  await makeGrid(cFiles.slice(0, 40), 'tests/inspect_batch2016_4/16H_cgrid_p1.jpg');
  await makeGrid(cFiles.slice(40, 80), 'tests/inspect_batch2016_4/16H_cgrid_p2.jpg');
  await makeGrid(cFiles.slice(80), 'tests/inspect_batch2016_4/16H_cgrid_p3.jpg');
}
main();
