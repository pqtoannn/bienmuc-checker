import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function gridPairs() {
  const p = (name) => `tests/inspect_batch2016_5/${name}`;
  // 052 vs 053
  // 055 vs 056
  const W = 400, H = 250;
  const list = ['pair_052.jpg', 'pair_053.jpg', 'pair_055.jpg', 'pair_056.jpg', 'pair_142.jpg', 'pair_143.jpg', 'pair_147.jpg', 'pair_148.jpg'];
  const composites = [];
  for (let i = 0; i < list.length; i++) {
    const b = await sharp(p(list[i])).resize(W, H).toBuffer();
    composites.push({ input: b, left: (i % 2) * W, top: Math.floor(i / 2) * (H + 20) + 20 });
    const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${list[i]}</text></svg>`);
    composites.push({ input: svg, left: (i % 2) * W, top: Math.floor(i / 2) * (H + 20) });
  }
  await sharp({ create: { width: W * 2, height: 4 * (H + 20), channels: 3, background: { r: 10, g: 10, b: 10 } } })
    .composite(composites).jpeg().toFile(p('grid_pairs.jpg'));
  console.log('Saved grid_pairs.jpg');
}
gridPairs();
