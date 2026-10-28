import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeBetterOverview(files, outName) {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const W = 700, H = 220;
  const canvas = sharp({
    create: { width: W, height: files.length * (H + 20), channels: 3, background: { r: 20, g: 20, b: 20 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const topY = i * (H + 20);
    const meta = await sharp(pDir + '/' + f).metadata();
    const buf = await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.05),
        top: Math.round(meta.height * 0.20),
        width: Math.round(meta.width * 0.92),
        height: Math.round(meta.height * 0.35)
      })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: buf, left: 0, top: topY + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="10" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: 0, top: topY });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile('tests/inspect_batch2016_5/' + outName);
  console.log('Saved ' + outName);
}

async function run() {
  await makeBetterOverview(['015.jpg', '016.jpg', '017.jpg', '018.jpg', '019.jpg', '020.jpg', '021.jpg'], 'better_015_021.jpg');
  await makeBetterOverview(['024.jpg', '025.jpg', '026.jpg', '027.jpg', '028.jpg', '029.jpg'], 'better_024_029.jpg');
  await makeBetterOverview(['030.jpg', '031.jpg', '032.jpg', '033.jpg', '034.jpg', '035.jpg'], 'better_030_035.jpg');
  await makeBetterOverview(['048.jpg', '049.jpg', '050.jpg', '051.jpg', '052.jpg'], 'better_048_052.jpg');
  await makeBetterOverview(['067.jpg', '068.jpg', '069.jpg', '070.jpg', '071.jpg'], 'better_067_071.jpg');
  await makeBetterOverview(['072.jpg', '073.jpg', '074.jpg', '075.jpg', '076.jpg', '077.jpg', '078.jpg'], 'better_072_078.jpg');
  await makeBetterOverview(['143.jpg', '144.jpg', '145.jpg', '146.jpg', '147.jpg', '148.jpg', '149.jpg'], 'better_143_149.jpg');
  await makeBetterOverview(['150.jpg', '151.jpg', '152.jpg', '153.jpg', '154.jpg', '155.jpg'], 'better_150_155.jpg');
}

run();
