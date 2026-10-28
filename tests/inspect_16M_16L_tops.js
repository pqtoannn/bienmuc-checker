import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function inspect16M() {
  const dir = path.join(P_PHOTOS, 'PL_2016_16M');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
  for (const f of files) {
    const p = path.join(dir, f);
    // save a clear medium view of top 40%
    const meta = await sharp(p).metadata();
    await sharp(p)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.45) })
      .resize({ width: 900 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT_DIR, `16M_top_${f}`));
  }
}

async function inspect16L() {
  const dir = path.join(P_PHOTOS, 'PL_2016_16L');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
  for (const f of files) {
    const p = path.join(dir, f);
    const meta = await sharp(p).metadata();
    await sharp(p)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.45) })
      .resize({ width: 900 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT_DIR, `16L_top_${f}`));
  }
}

async function main() {
  await inspect16M();
  await inspect16L();
  console.log('Inspected 16M and 16L tops');
}
main();
