import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const inspectDir = 'd:/BG/Check_HS_BM/tests/inspect_22P';

async function makeTrCollage(fileNums, outFile) {
  const cols = 3;
  const rows = Math.ceil(fileNums.length / cols);
  const cellW = 420;
  const cellH = 240;
  const W = cols * cellW;
  const H = rows * cellH;

  const composites = [];

  for (let i = 0; i < fileNums.length; i++) {
    const num = fileNums[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = col * cellW;
    const top = row * cellH;

    const imgBuf = await sharp(path.join(inspectDir, `${num}_tr.jpg`))
      .resize({ width: cellW - 10, height: cellH - 32, fit: 'inside' })
      .toBuffer();

    composites.push({
      input: imgBuf,
      left: left + 5,
      top: top + 28,
    });

    const svg = Buffer.from(
      `<svg width="${cellW}" height="28"><rect width="100%" height="100%" fill="#1a365d"/><text x="10" y="20" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">${num}.jpg</text></svg>`
    );
    composites.push({
      input: svg,
      left: left,
      top: top,
    });
  }

  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 235, g: 235, b: 235 } },
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

  for (let b = 0; b < 6; b++) {
    const batch = allNums.slice(b * 18, (b + 1) * 18);
    await makeTrCollage(batch, `tr_col_${b + 1}.jpg`);
  }
}

run();
