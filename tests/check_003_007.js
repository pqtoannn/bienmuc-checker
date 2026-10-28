import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function check003to012() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const list = ['002.jpg', '003.jpg', '004.jpg', '005.jpg', '006.jpg', '007.jpg', '009.jpg', '010.jpg', '011.jpg', '012.jpg'];
  const composites = [];
  const W = 350, H = 150;
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    const meta = await sharp(pDir + '/' + f).metadata();
    const b = await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.75),
        top: Math.round(meta.height * 0.20),
        width: Math.round(meta.width * 0.24),
        height: Math.round(meta.height * 0.22)
      })
      .resize(W, H).toBuffer();
    composites.push({ input: b, left: (i % 2) * W, top: Math.floor(i / 2) * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: (i % 2) * W, top: Math.floor(i / 2) * (H + 20) });
  }
  await sharp({ create: { width: W * 2, height: 5 * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites).jpeg().toFile('tests/inspect_batch2016_5/corners_002_012_correct.jpg');
  console.log('Saved corners_002_012_correct.jpg');
}
check003to012();
