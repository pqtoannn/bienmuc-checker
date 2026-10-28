import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1/16A';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function analyze16A() {
  const dir = path.join(P_PHOTOS, 'PL_2016_16A');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Processing ${files.length} files of 16A...`);

  for (let i = 2; i <= 46; i++) {
    const fStr = String(i).padStart(3, '0') + '.jpg';
    const p = path.join(dir, fStr);
    const meta = await sharp(p).metadata();

    // Corner crop: top right 30% width, 18% height
    const cw = Math.floor(meta.width * 0.30);
    const ch = Math.floor(meta.height * 0.18);
    const cl = meta.width - cw;
    await sharp(p)
      .extract({ left: cl, top: 0, width: cw, height: ch })
      .resize({ width: 350 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT_DIR, `corner_${fStr}`));

    // Header crop: top 35% height
    await sharp(p)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.35) })
      .resize({ width: 850 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT_DIR, `header_${fStr}`));
  }
  console.log('Finished cropping 16A');
}

analyze16A().catch(console.error);
