import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  const outDir = 'tests/inspect_batch2016_4/16D_70s';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  const checkList = ['073.jpg', '074.jpg', '075.jpg', '076.jpg', '077.jpg', '078.jpg', '079.jpg', '080.jpg', '081.jpg', '082.jpg'];

  for (const f of checkList) {
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.70),
        top: Math.round(meta.height * 0.02),
        width: Math.round(meta.width * 0.29),
        height: Math.round(meta.height * 0.25)
      })
      .resize({width: 300})
      .toFile(outDir + '/' + f);
  }

  const W = 300, H = 180;
  const cols = 5;
  const rows = Math.ceil(checkList.length / cols);
  const canvas = sharp({
    create: { width: cols * W, height: rows * (H + 25), channels: 3, background: { r: 30, g: 30, b: 30 } }
  });
  const composites = [];
  for (let i = 0; i < checkList.length; i++) {
    const f = checkList[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const imgBuf = await sharp(path.join(outDir, f)).resize(W, H).toBuffer();
    composites.push({ input: imgBuf, left: col * W, top: row * (H + 25) + 25 });
    const svg = Buffer.from(`<svg width="${W}" height="25"><text x="10" y="18" font-size="16" fill="yellow" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: col * W, top: row * (H + 25) });
  }
  await canvas.composite(composites).jpeg({quality: 85}).toFile('tests/inspect_batch2016_4/16D_70s_grid.jpg');
  console.log('Saved 16D_70s_grid.jpg');
}
main();
