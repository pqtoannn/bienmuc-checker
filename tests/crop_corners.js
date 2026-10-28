import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function cropCorners(files, outName) {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const composites = [];
  const W = 320, H = 160;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const meta = await sharp(pDir + '/' + f).metadata();
    const buf = await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.70),
        top: Math.round(meta.height * 0.20),
        width: Math.round(meta.width * 0.29),
        height: Math.round(meta.height * 0.25)
      })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: buf, left: 0, top: i * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: 0, top: i * (H + 20) });
  }
  await sharp({ create: { width: W, height: files.length * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile('tests/inspect_batch2016_5/' + outName);
  console.log('Saved ' + outName);
}

cropCorners(['015.jpg', '016.jpg', '017.jpg', '018.jpg', '019.jpg', '020.jpg', '021.jpg'], 'corners_015_021.jpg');

async function makeZoomGrid() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const list = ['012.jpg', '013.jpg', '014.jpg', '015.jpg', '016.jpg', '017.jpg', '018.jpg', '019.jpg', '020.jpg', '021.jpg'];
  const composites = [];
  const W = 200, H = 150;
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    const b = await sharp(pDir + '/' + f).extract({left: 950, top: 150, width: 300, height: 250}).resize(W, H).toBuffer();
    composites.push({ input: b, left: (i % 5) * W, top: Math.floor(i / 5) * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: (i % 5) * W, top: Math.floor(i / 5) * (H + 20) });
  }
  await sharp({ create: { width: W * 5, height: 2 * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites).jpeg().toFile('tests/inspect_batch2016_5/grid_zoom_012_021.jpg');
  console.log('Saved grid_zoom_012_021.jpg');
}
makeZoomGrid();

cropCorners(['022.jpg', '023.jpg', '024.jpg', '025.jpg', '026.jpg', '027.jpg', '028.jpg'], 'corners_022_028.jpg');
cropCorners(['029.jpg', '030.jpg', '031.jpg', '032.jpg', '033.jpg', '034.jpg', '035.jpg', '036.jpg'], 'corners_029_036.jpg');

cropCorners(['048.jpg', '049.jpg', '050.jpg', '051.jpg', '052.jpg'], 'corners_048_052.jpg');
cropCorners(['067.jpg', '068.jpg', '069.jpg', '070.jpg', '071.jpg'], 'corners_067_071.jpg');
cropCorners(['072.jpg', '073.jpg', '074.jpg', '075.jpg', '076.jpg', '077.jpg', '078.jpg'], 'corners_072_078.jpg');
cropCorners(['143.jpg', '144.jpg', '145.jpg', '146.jpg', '147.jpg', '148.jpg', '149.jpg'], 'corners_143_149.jpg');
cropCorners(['150.jpg', '151.jpg', '152.jpg', '153.jpg', '154.jpg', '155.jpg'], 'corners_150_155.jpg');

async function cropTopCorners(files, outName) {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const composites = [];
  const W = 350, H = 150;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const meta = await sharp(pDir + '/' + f).metadata();
    const buf = await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.60),
        top: Math.round(meta.height * 0.07),
        width: Math.round(meta.width * 0.38),
        height: Math.round(meta.height * 0.20)
      })
      .resize(W, H)
      .toBuffer();
    composites.push({ input: buf, left: 0, top: i * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: 0, top: i * (H + 20) });
  }
  await sharp({ create: { width: W, height: files.length * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile('tests/inspect_batch2016_5/' + outName);
  console.log('Saved ' + outName);
}

cropTopCorners(['072.jpg', '073.jpg', '074.jpg', '075.jpg', '076.jpg', '077.jpg', '078.jpg'], 'top_072_078.jpg');
cropTopCorners(['142.jpg', '143.jpg', '144.jpg', '145.jpg', '146.jpg', '147.jpg', '148.jpg', '149.jpg'], 'top_142_149.jpg');
cropTopCorners(['150.jpg', '151.jpg', '152.jpg', '153.jpg', '154.jpg', '155.jpg', '156.jpg', '157.jpg'], 'top_150_157.jpg');

cropTopCorners(['085.jpg', '086.jpg', '087.jpg', '088.jpg', '089.jpg', '090.jpg'], 'top_085_090.jpg');
cropTopCorners(['091.jpg', '092.jpg', '093.jpg', '094.jpg', '095.jpg', '096.jpg'], 'top_091_096.jpg');
