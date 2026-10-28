import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const inspectDir = 'd:/BG/Check_HS_BM/tests/inspect_22P';

async function makeHdCollage(fileNums, outFile) {
  const cols = 2;
  const rows = Math.ceil(fileNums.length / cols);
  const cellW = 750;
  const cellH = 220;
  const W = cols * cellW;
  const H = rows * cellH;

  const composites = [];

  for (let i = 0; i < fileNums.length; i++) {
    const num = fileNums[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = col * cellW;
    const top = row * cellH;

    const imgBuf = await sharp(path.join(inspectDir, `${num}_hd.jpg`))
      .resize({ width: cellW - 10, height: cellH - 30, fit: 'inside' })
      .toBuffer();

    composites.push({
      input: imgBuf,
      left: left + 5,
      top: top + 25,
    });

    const svg = Buffer.from(
      `<svg width="${cellW}" height="25"><rect width="100%" height="100%" fill="#1a365d"/><text x="10" y="18" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">${num}.jpg</text></svg>`
    );
    composites.push({
      input: svg,
      left: left,
      top: top,
    });
  }

  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 225, g: 225, b: 225 } },
  })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(path.join(inspectDir, outFile));

  console.log(`Saved ${outFile}`);
}

async function run() {
  const allNums = [];
  for (let i = 1; i <= 108; i++) {
    allNums.push(String(i).padStart(3, '0'));
  }

  for (let b = 0; b < 9; b++) {
    const batch = allNums.slice(b * 12, (b + 1) * 12);
    await makeHdCollage(batch, `hd_col_${b + 1}.jpg`);
  }
}

run();
