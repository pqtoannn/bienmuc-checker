import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeMini110() {
  const compList = [];
  const tileW = 250;
  const tileH = 120;
  const cols = 4;
  for (let i = 110; i <= 120; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const buf = await sharp('tests/inspect_batch/PL_2021_21p/z110_' + fn).resize(tileW, tileH).toBuffer();
    const badge = Buffer.from(
      '<svg width="' + tileW + '" height="' + tileH + '">' +
        '<rect x="0" y="0" width="35" height="18" fill="black" />' +
        '<text x="3" y="14" font-family="Arial" font-size="12" fill="#00ffcc" font-weight="bold">' + fn.slice(0,3) + '</text>' +
      '</svg>'
    );
    const tile = await sharp(buf).composite([{ input: badge, left: 0, top: 0 }]).toBuffer();
    const idx = i - 110;
    compList.push({ input: tile, left: (idx % cols) * tileW, top: Math.floor(idx / cols) * tileH });
  }
  await sharp({
    create: { width: cols * tileW, height: 3 * tileH, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite(compList).toFile('tests/inspect_batch/PL_2021_21p/mini_110_120.jpg');
  console.log('Done mini 110');
}
makeMini110();
