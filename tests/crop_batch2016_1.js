import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function cropCorners(dosId) {
  const dosDir = path.join(P_PHOTOS, dosId);
  const files = fs.readdirSync(dosDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Cropping ${dosId}: ${files.length} files...`);

  for (const f of files) {
    const filePath = path.join(dosDir, f);
    const meta = await sharp(filePath).metadata();
    const w = meta.width;
    const h = meta.height;

    // Corner crop: top right (where pencil sheet numbers are written)
    // usually right 20% and top 15%
    const cropW = Math.floor(w * 0.25);
    const cropH = Math.floor(h * 0.18);
    const left = w - cropW;
    const top = 0;

    const cornerOut = path.join(OUT_DIR, `${dosId}_corner_${f}`);
    await sharp(filePath)
      .extract({ left, top, width: cropW, height: cropH })
      .resize({ width: 300 })
      .jpeg({ quality: 80 })
      .toFile(cornerOut);

    // Header crop: top 25% of image (full width) to see document number, author, title
    const headerH = Math.floor(h * 0.30);
    const headerOut = path.join(OUT_DIR, `${dosId}_header_${f}`);
    await sharp(filePath)
      .extract({ left: 0, top: 0, width: w, height: headerH })
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(headerOut);
  }
}

async function main() {
  await cropCorners('PL_2016_16M');
  await cropCorners('PL_2016_16L');
  await cropCorners('PL_2016_16A');
  console.log('Finished cropping for batch 2016-1.');
}

main().catch(console.error);
