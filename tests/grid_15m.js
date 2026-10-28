import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function grid15M() {
  const p = (i) => `tests/inspect_batch2015_1/15M/${String(i).padStart(3, '0')}.jpg`;
  const W = 400, H = 250;
  const composites = [];
  for (let i = 1; i <= 6; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    const b = await sharp(p(i)).resize(W, H).toBuffer();
    const idx = i - 1;
    composites.push({ input: b, left: (idx % 3) * W, top: Math.floor(idx / 3) * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: (idx % 3) * W, top: Math.floor(idx / 3) * (H + 20) });
  }
  await sharp({ create: { width: W * 3, height: 2 * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites).jpeg().toFile('tests/inspect_batch2015_1/grid_15M.jpg');
  console.log('Saved grid_15M.jpg');
}
grid15M();
