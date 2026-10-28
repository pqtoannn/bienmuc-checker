import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeLabeledMontages() {
  const ranges = [
    [1, 30],
    [31, 60],
    [61, 90],
    [91, 120],
    [121, 150],
    [151, 180],
    [181, 208]
  ];

  const tileW = 200;
  const tileH = 120;
  const cols = 5;

  for (let mIdx = 0; mIdx < ranges.length; mIdx++) {
    const [start, end] = ranges[mIdx];
    const compList = [];
    const count = end - start + 1;
    const rows = Math.ceil(count / cols);

    for (let i = start; i <= end; i++) {
      const idxInM = i - start;
      const col = idxInM % cols;
      const row = Math.floor(idxInM / cols);
      const fn = String(i).padStart(3, '0') + '.jpg';
      const buf = await sharp('tests/inspect_batch/PL_2021_21o/c_' + fn)
        .resize(tileW, tileH)
        .toBuffer();
      
      // composite label badge onto tile
      const badgeSvg = Buffer.from(
        `<svg width="${tileW}" height="${tileH}">
          <rect x="0" y="0" width="35" height="18" fill="black" />
          <text x="3" y="14" font-family="Arial" font-size="12" fill="#00ffcc" font-weight="bold">${String(i).padStart(3, '0')}</text>
        </svg>`
      );
      const tileWithBadge = await sharp(buf).composite([{ input: badgeSvg, left: 0, top: 0 }]).toBuffer();

      compList.push({ input: tileWithBadge, left: col * tileW, top: row * tileH });
    }

    await sharp({
      create: {
        width: cols * tileW,
        height: rows * tileH,
        channels: 3,
        background: { r: 20, g: 20, b: 20 }
      }
    }).composite(compList).toFile('tests/inspect_batch/PL_2021_21o/cmontage_' + (mIdx + 1) + '.jpg');
  }
  console.log('All 7 labeled corner montages created!');
}

makeLabeledMontages();
