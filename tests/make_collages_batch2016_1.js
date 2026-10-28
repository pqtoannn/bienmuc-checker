import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const IN_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function makeGrid(dosId, count, prefix = '') {
  // We want to combine corner crops and header crops into an easy-to-read collage
  // For each file from 2 to count:
  // corner: 300x(cropH), header: 800x(cropH)
  const cellW = 350;
  const cellH = 220;
  const cols = 5;
  const items = [];

  for (let i = 2; i <= count; i++) {
    const fStr = String(i).padStart(3, '0');
    const cornerPath = path.join(IN_DIR, `${dosId}_corner_${fStr}.jpg`);
    const headerPath = path.join(IN_DIR, `${dosId}_header_${fStr}.jpg`);
    if (fs.existsSync(cornerPath)) {
      // Resize corner to width 320, max height 180
      const cBuf = await sharp(cornerPath).resize({ width: 320, height: 180, fit: 'inside' }).toBuffer();
      // Add label text via SVG or simple background
      const svgLabel = Buffer.from(
        `<svg width="320" height="30"><rect width="320" height="30" fill="#000000"/><text x="10" y="20" font-size="18" fill="#ffffff" font-family="sans-serif">${dosId} - ${fStr}</text></svg>`
      );
      const combined = await sharp({
        create: { width: 320, height: 215, channels: 3, background: { r: 240, g: 240, b: 240 } }
      }).composite([
        { input: svgLabel, left: 0, top: 0 },
        { input: cBuf, left: 0, top: 32 }
      ]).jpeg().toBuffer();
      items.push({ num: i, buf: combined });
    }
  }

  const numRows = Math.ceil(items.length / cols);
  const composites = items.map((it, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    return { input: it.buf, left: c * (cellW + 10) + 10, top: r * (cellH + 10) + 10 };
  });

  const collageW = cols * (cellW + 10) + 10;
  const collageH = numRows * (cellH + 10) + 10;

  const outPath = path.join(IN_DIR, `${dosId}_corners_collage.jpg`);
  await sharp({
    create: { width: collageW, height: collageH, channels: 3, background: { r: 200, g: 200, b: 200 } }
  }).composite(composites).jpeg({ quality: 90 }).toFile(outPath);

  console.log(`Saved ${outPath}`);
}

async function main() {
  await makeGrid('PL_2016_16M', 8);
  await makeGrid('PL_2016_16L', 11);
  await makeGrid('PL_2016_16A', 46);
}

main().catch(console.error);
