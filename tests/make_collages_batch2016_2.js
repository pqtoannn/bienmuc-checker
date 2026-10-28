import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const BASE_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_2';

async function makeCollage(dosId, start, end, outName) {
  const dir = path.join(BASE_DIR, dosId);
  const items = [];

  for (let i = start; i <= end; i++) {
    const fStr = String(i).padStart(3, '0') + '.jpg';
    const cp = path.join(dir, `corner_${fStr}`);
    const hp = path.join(dir, `header_${fStr}`);

    const cBuf = await sharp(cp).resize({ width: 250, height: 130, fit: 'inside' }).toBuffer();
    const hBuf = await sharp(hp).resize({ width: 550, height: 130, fit: 'inside' }).toBuffer();

    const cMeta = await sharp(cBuf).metadata();
    const hMeta = await sharp(hBuf).metadata();

    const rowW = 250 + 550 + 20;
    const rowH = Math.max(cMeta.height, hMeta.height) + 24;

    const lbl = Buffer.from(
      `<svg width="${rowW}" height="22"><rect width="${rowW}" height="22" fill="#0f172a"/><text x="10" y="16" font-size="14" font-weight="bold" fill="#38bdf8" font-family="sans-serif">${dosId} - ${fStr}</text></svg>`
    );

    const rowBuf = await sharp({
      create: { width: rowW, height: rowH, channels: 3, background: { r: 245, g: 245, b: 245 } }
    }).composite([
      { input: lbl, left: 0, top: 0 },
      { input: cBuf, left: 10, top: 23 },
      { input: hBuf, left: 265, top: 23 }
    ]).jpeg().toBuffer();

    items.push(rowBuf);
  }

  const totalW = 820;
  let totalH = 0;
  const composites = [];
  for (const it of items) {
    const meta = await sharp(it).metadata();
    composites.push({ input: it, left: 0, top: totalH });
    totalH += meta.height + 4;
  }

  await sharp({
    create: { width: totalW, height: totalH, channels: 3, background: { r: 210, g: 210, b: 210 } }
  }).composite(composites).jpeg({ quality: 85 }).toFile(path.join(BASE_DIR, outName));
  console.log(`Saved ${outName}`);
}

async function checkCovers() {
  for (const dos of ['PL_2016_16I', 'PL_2016_16J', 'PL_2016_16F']) {
    const p = path.join(BASE_DIR, dos, 'page_001.jpg');
    await sharp(p).resize(600).toFile(path.join(BASE_DIR, `${dos}_cover.jpg`));
  }
  console.log('Saved covers');
}

async function main() {
  await checkCovers();

  // 16I (50 files)
  await makeCollage('PL_2016_16I', 2, 26, '16I_part1_002_026.jpg');
  await makeCollage('PL_2016_16I', 27, 50, '16I_part2_027_050.jpg');

  // 16J (65 files)
  await makeCollage('PL_2016_16J', 2, 33, '16J_part1_002_033.jpg');
  await makeCollage('PL_2016_16J', 34, 65, '16J_part2_034_065.jpg');

  // 16F (66 files)
  await makeCollage('PL_2016_16F', 2, 34, '16F_part1_002_034.jpg');
  await makeCollage('PL_2016_16F', 35, 66, '16F_part2_035_066.jpg');

  console.log('Finished generating collages for batch 2016-2.');
}

main().catch(console.error);
