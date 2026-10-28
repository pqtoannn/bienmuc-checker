import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function makeHeaderCornerGrid(files, outName) {
  const cropDir = 'tests/inspect_batch2016_5/crops';
  const W_hdr = 500, H_hdr = 200;
  const W_crn = 200, H_crn = 200;
  const rowH = 225;
  const totalW = W_hdr + W_crn;
  const totalH = files.length * rowH;

  const canvas = sharp({
    create: { width: totalW, height: totalH, channels: 3, background: { r: 20, g: 20, b: 20 } }
  });

  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const topY = i * rowH;
    const hdrBuf = await sharp(path.join(cropDir, f.replace('.jpg', '_header.jpg'))).resize(W_hdr, H_hdr).toBuffer();
    const crnBuf = await sharp(path.join(cropDir, f.replace('.jpg', '_corner.jpg'))).resize(W_crn, H_crn).toBuffer();
    
    composites.push({ input: hdrBuf, left: 0, top: topY + 25 });
    composites.push({ input: crnBuf, left: W_hdr, top: topY + 25 });
    
    const svg = Buffer.from(`<svg width="${totalW}" height="25"><text x="10" y="18" font-size="18" fill="#00ff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: 0, top: topY });
  }

  await canvas.composite(composites).jpeg({ quality: 85 }).toFile('tests/inspect_batch2016_5/' + outName);
  console.log('Saved ' + outName);
}

async function run() {
  await makeHeaderCornerGrid(['121.jpg', '122.jpg', '123.jpg', '124.jpg', '125.jpg'], 'grid_121_125.jpg');
  await makeHeaderCornerGrid(['158.jpg', '159.jpg', '160.jpg', '161.jpg', '162.jpg', '163.jpg', '164.jpg'], 'grid_158_164.jpg');
  await makeHeaderCornerGrid(['015.jpg', '016.jpg', '017.jpg', '018.jpg', '019.jpg', '020.jpg', '021.jpg'], 'grid_015_021.jpg');
  await makeHeaderCornerGrid(['024.jpg', '025.jpg', '026.jpg', '027.jpg'], 'grid_024_027.jpg');
  await makeHeaderCornerGrid(['030.jpg', '031.jpg', '032.jpg', '033.jpg'], 'grid_030_033.jpg');
  await makeHeaderCornerGrid(['049.jpg', '050.jpg', '051.jpg', '052.jpg'], 'grid_049_052.jpg');
  await makeHeaderCornerGrid(['068.jpg', '069.jpg', '070.jpg'], 'grid_068_070.jpg');
  await makeHeaderCornerGrid(['072.jpg', '073.jpg', '074.jpg'], 'grid_072_074.jpg');
  await makeHeaderCornerGrid(['077.jpg', '078.jpg', '079.jpg'], 'grid_077_079.jpg');
  await makeHeaderCornerGrid(['144.jpg', '145.jpg', '146.jpg', '147.jpg', '148.jpg'], 'grid_144_148.jpg');
  await makeHeaderCornerGrid(['151.jpg', '152.jpg', '153.jpg', '154.jpg'], 'grid_151_154.jpg');
}

run();
