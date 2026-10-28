import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const IN_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1/16A';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function makeGroupCollage(start, end, outName) {
  const items = [];
  for (let i = start; i <= end; i++) {
    const fStr = String(i).padStart(3, '0') + '.jpg';
    const cp = path.join(IN_DIR, `corner_${fStr}`);
    const hp = path.join(IN_DIR, `header_${fStr}`);
    
    const cBuf = await sharp(cp).resize({ width: 250, height: 140, fit: 'inside' }).toBuffer();
    const hBuf = await sharp(hp).resize({ width: 550, height: 140, fit: 'inside' }).toBuffer();
    
    const cMeta = await sharp(cBuf).metadata();
    const hMeta = await sharp(hBuf).metadata();
    
    const rowW = 250 + 550 + 20;
    const rowH = Math.max(cMeta.height, hMeta.height) + 26;
    
    const lbl = Buffer.from(
      `<svg width="${rowW}" height="24"><rect width="${rowW}" height="24" fill="#0f172a"/><text x="10" y="17" font-size="15" font-weight="bold" fill="#38bdf8" font-family="sans-serif">16A - ${fStr}</text></svg>`
    );
    
    const rowBuf = await sharp({
      create: { width: rowW, height: rowH, channels: 3, background: { r: 245, g: 245, b: 245 } }
    }).composite([
      { input: lbl, left: 0, top: 0 },
      { input: cBuf, left: 10, top: 25 },
      { input: hBuf, left: 265, top: 25 }
    ]).jpeg().toBuffer();
    
    items.push(rowBuf);
  }

  // Stack all rows vertically
  const totalW = 820;
  let totalH = 0;
  const composites = [];
  for (const it of items) {
    const meta = await sharp(it).metadata();
    composites.push({ input: it, left: 0, top: totalH });
    totalH += meta.height + 6;
  }

  await sharp({
    create: { width: totalW, height: totalH, channels: 3, background: { r: 210, g: 210, b: 210 } }
  }).composite(composites).jpeg({ quality: 85 }).toFile(path.join(OUT_DIR, outName));
  console.log(`Saved ${outName}`);
}

async function main() {
  await makeGroupCollage(2, 16, '16A_group1_002_016.jpg');
  await makeGroupCollage(17, 31, '16A_group2_017_031.jpg');
  await makeGroupCollage(32, 46, '16A_group3_032_046.jpg');
}

main().catch(console.error);
