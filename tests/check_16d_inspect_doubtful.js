import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  const outDir = 'tests/inspect_batch2016_4/16D_doubtful';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  // Check scans: 070, 071, 072, 073, 091, 092, 093, 098, 099, 100, 101, 102, 109, 110, 111
  const checkList = ['070.jpg', '071.jpg', '072.jpg', '073.jpg', '091.jpg', '092.jpg', '093.jpg', '098.jpg', '099.jpg', '100.jpg', '101.jpg', '102.jpg', '109.jpg', '110.jpg', '111.jpg'];

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
  await canvas.composite(composites).jpeg({quality: 85}).toFile('tests/inspect_batch2016_4/16D_doubtful_grid.jpg');
  console.log('Saved tests/inspect_batch2016_4/16D_doubtful_grid.jpg');
}
main();
