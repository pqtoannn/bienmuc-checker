import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const dossier = process.argv[2] || 'PL_2021_21i';
const startIdx = parseInt(process.argv[3] || '100');
const endIdx = parseInt(process.argv[4] || '125');
const outFile = process.argv[5] || 'tests/inspect_batch/sub_check.jpg';

const dir = path.join('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos', dossier);

async function run() {
  const items = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const p = String(i).padStart(3, '0') + '.jpg';
    const src = path.join(dir, p);
    if (!fs.existsSync(src)) continue;
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;
    const buf = await sharp(src)
      .extract({ left: Math.round(w * 0.45), top: 0, width: Math.round(w * 0.5), height: Math.round(h * 0.16) })
      .resize(320, 110)
      .composite([{
        input: Buffer.from(`<svg width="320" height="30"><rect x="0" y="0" width="70" height="24" fill="black"/><text x="5" y="17" font-family="Arial" font-size="14" font-weight="bold" fill="yellow">${p.replace('.jpg','')}</text></svg>`),
        top: 0,
        left: 0
      }])
      .toBuffer();
    items.push(buf);
  }

  const cols = 3;
  const itemW = 320;
  const itemH = 110;
  const composites = items.map((buf, idx) => ({
    input: buf,
    left: (idx % cols) * itemW,
    top: Math.floor(idx / cols) * itemH
  }));

  await sharp({
    create: {
      width: cols * itemW,
      height: Math.ceil(items.length / cols) * itemH,
      channels: 3,
      background: { r: 10, g: 10, b: 10 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(outFile);
  console.log(`Saved ${outFile}`);
}

run();
