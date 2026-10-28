import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  const outDir = 'tests/inspect_batch2016_4/16D_55_65';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  for (let i = 55; i <= 65; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.75),
        top: Math.round(meta.height * 0.03),
        width: Math.round(meta.width * 0.23),
        height: Math.round(meta.height * 0.16)
      })
      .resize({ width: 350 })
      .toFile(outDir + '/' + f);
  }

  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg')).sort();
  const W = 350, H = 200;
  const cols = 4;
  const rows = Math.ceil(files.length / cols);
  const canvas = sharp({
    create: { width: cols * W, height: rows * (H + 25), channels: 3, background: { r: 30, g: 30, b: 30 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const imgBuf = await sharp(path.join(outDir, f)).resize(W, H).toBuffer();
    composites.push({ input: imgBuf, left: col * W, top: row * (H + 25) + 25 });
    const svg = Buffer.from(`<svg width="${W}" height="25"><text x="10" y="18" font-size="16" fill="yellow" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: col * W, top: row * (H + 25) });
  }
  await canvas.composite(composites).jpeg({quality: 85}).toFile('tests/inspect_batch2016_4/16D_55_65_grid.jpg');
  console.log('Saved 16D_55_65_grid.jpg');
}
main();
