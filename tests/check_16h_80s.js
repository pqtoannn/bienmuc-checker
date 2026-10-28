import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16H';
  const outDir = 'tests/inspect_batch2016_4/16H_80s';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  for (let i = 82; i <= 88; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    const meta = await sharp(pDir + '/' + f).metadata();
    // Top right corner
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.72),
        top: Math.round(meta.height * 0.05),
        width: Math.round(meta.width * 0.27),
        height: Math.round(meta.height * 0.35)
      })
      .resize({width: 350})
      .toFile(outDir + '/' + f);
  }

  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg')).sort();
  const W = 350, H = 250;
  const cols = files.length;
  const canvas = sharp({
    create: { width: cols * W, height: H + 30, channels: 3, background: { r: 30, g: 30, b: 30 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const imgBuf = await sharp(path.join(outDir, f)).resize(W, H).toBuffer();
    composites.push({ input: imgBuf, left: i * W, top: 30 });
    const svg = Buffer.from(`<svg width="${W}" height="30"><text x="10" y="20" font-size="18" fill="yellow" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: i * W, top: 0 });
  }
  await canvas.composite(composites).jpeg({quality: 85}).toFile('tests/inspect_batch2016_4/16H_80s_grid.jpg');
  console.log('Saved tests/inspect_batch2016_4/16H_80s_grid.jpg');
}
main();
