import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function gridDoubtful() {
  const p = (name) => `tests/inspect_batch2015_2/15H/${name}`;
  const files = ['check_041.jpg', 'check_042.jpg', 'check_043.jpg', 'check_044.jpg', 'check_045.jpg', 'check_046.jpg', 'check_047.jpg'];
  const W = 400, H = 250;
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const b = await sharp(p(f)).resize(W, H).toBuffer();
    composites.push({ input: b, left: (i % 2) * W, top: Math.floor(i / 2) * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
    composites.push({ input: svg, left: (i % 2) * W, top: Math.floor(i / 2) * (H + 20) });
  }
  await sharp({ create: { width: W * 2, height: 4 * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites).jpeg().toFile('tests/inspect_batch2015_2/15H/grid_doubtful_41_47.jpg');
}
gridDoubtful();
