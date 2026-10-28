import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function makeSheetCollage(dosId, start, end, outName, cols = 4) {
  const subDir = path.join(OUT_DIR, dosId);
  const items = [];
  for (let i = start; i <= end; i++) {
    const fStr = String(i).padStart(3, '0') + '.jpg';
    const p = path.join(subDir, `page_${fStr}`);
    if (fs.existsSync(p)) {
      const b = await sharp(p).resize({ width: 320, height: 450, fit: 'inside' }).toBuffer();
      const meta = await sharp(b).metadata();
      const label = Buffer.from(
        `<svg width="${meta.width}" height="28"><rect width="${meta.width}" height="28" fill="#111827"/><text x="10" y="20" font-size="16" font-weight="bold" fill="#38bdf8" font-family="sans-serif">${dosId} - ${fStr}</text></svg>`
      );
      const cell = await sharp({
        create: { width: meta.width, height: meta.height + 30, channels: 3, background: { r: 240, g: 240, b: 240 } }
      }).composite([
        { input: label, left: 0, top: 0 },
        { input: b, left: 0, top: 28 }
      ]).jpeg().toBuffer();
      items.push(cell);
    }
  }

  const cellW = 330;
  const cellH = 490;
  const numRows = Math.ceil(items.length / cols);
  const composites = items.map((it, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    return { input: it, left: c * cellW, top: r * cellH };
  });

  await sharp({
    create: { width: cols * cellW, height: numRows * cellH, channels: 3, background: { r: 220, g: 220, b: 220 } }
  }).composite(composites).jpeg({ quality: 85 }).toFile(path.join(OUT_DIR, outName));
  console.log(`Saved ${outName}`);
}

async function main() {
  await makeSheetCollage('PL_2016_16M', 1, 8, '16M_all_pages.jpg', 4);
  await makeSheetCollage('PL_2016_16L', 1, 11, '16L_all_pages.jpg', 4);
  await makeSheetCollage('PL_2016_16A', 1, 12, '16A_pages_01_12.jpg', 4);
  await makeSheetCollage('PL_2016_16A', 13, 24, '16A_pages_13_24.jpg', 4);
  await makeSheetCollage('PL_2016_16A', 25, 36, '16A_pages_25_36.jpg', 4);
  await makeSheetCollage('PL_2016_16A', 37, 46, '16A_pages_37_46.jpg', 4);
}

main().catch(console.error);
