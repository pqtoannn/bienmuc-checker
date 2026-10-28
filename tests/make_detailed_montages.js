import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeDetailedMontages() {
  const batches = [
    { name: 'mA', start: 30, end: 65 },
    { name: 'mB', start: 66, end: 110 },
    { name: 'mC', start: 111, end: 150 },
    { name: 'mD', start: 151, end: 185 }
  ];

  const tileW = 220;
  const tileH = 100;
  const cols = 5;

  for (const b of batches) {
    const compList = [];
    const count = b.end - b.start + 1;
    const rows = Math.ceil(count / cols);

    for (let i = b.start; i <= b.end; i++) {
      const idxInM = i - b.start;
      const col = idxInM % cols;
      const row = Math.floor(idxInM / cols);
      const fn = String(i).padStart(3, '0') + '.jpg';
      const buf = await sharp('tests/inspect_batch/PL_2021_21p/cw_' + fn).resize(tileW, tileH).toBuffer();
      const badge = Buffer.from(
        '<svg width="' + tileW + '" height="' + tileH + '">' +
          '<rect x="0" y="0" width="35" height="18" fill="black" />' +
          '<text x="3" y="14" font-family="Arial" font-size="12" fill="#00ffcc" font-weight="bold">' + fn.slice(0,3) + '</text>' +
        '</svg>'
      );
      const tile = await sharp(buf).composite([{ input: badge, left: 0, top: 0 }]).toBuffer();
      compList.push({ input: tile, left: col * tileW, top: row * tileH });
    }

    await sharp({
      create: { width: cols * tileW, height: rows * tileH, channels: 3, background: { r: 20, g: 20, b: 20 } }
    }).composite(compList).toFile('tests/inspect_batch/PL_2021_21p/inspect_' + b.name + '.jpg');
  }
  console.log('Detailed montages created');
}
makeDetailedMontages();
