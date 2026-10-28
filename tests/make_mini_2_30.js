import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeMini2to30() {
  const compList = [];
  const tileW = 200;
  const tileH = 100;
  const cols = 5;
  for (let i = 2; i <= 30; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const buf = await sharp('tests/inspect_batch/PL_2021_21p/cw_' + fn).resize(tileW, tileH).toBuffer();
    const badge = Buffer.from(
      '<svg width="' + tileW + '" height="' + tileH + '">' +
        '<rect x="0" y="0" width="35" height="18" fill="black" />' +
        '<text x="3" y="14" font-family="Arial" font-size="12" fill="#00ffcc" font-weight="bold">' + fn.slice(0,3) + '</text>' +
      '</svg>'
    );
    const tile = await sharp(buf).composite([{ input: badge, left: 0, top: 0 }]).toBuffer();
    const idx = i - 2;
    compList.push({ input: tile, left: (idx % cols) * tileW, top: Math.floor(idx / cols) * tileH });
  }
  await sharp({
    create: { width: cols * tileW, height: 6 * tileH, channels: 3, background: { r: 20, g: 20, b: 20 } }
  }).composite(compList).toFile('tests/inspect_batch/PL_2021_21p/mini_2_30.jpg');
  console.log('Done mini 2-30');
}
makeMini2to30();
