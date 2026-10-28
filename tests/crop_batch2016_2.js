import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_2';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function cropDossier(dosId) {
  const dosDir = path.join(P_PHOTOS, dosId);
  const outSub = path.join(OUT_DIR, dosId);
  if (!fs.existsSync(outSub)) fs.mkdirSync(outSub, { recursive: true });

  const files = fs.readdirSync(dosDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Cropping ${dosId}: ${files.length} files...`);

  for (const f of files) {
    const filePath = path.join(dosDir, f);
    const meta = await sharp(filePath).metadata();
    const w = meta.width;
    const h = meta.height;

    // Corner crop: top right 32% width, 22% height
    const cw = Math.floor(w * 0.32);
    const ch = Math.floor(h * 0.22);
    const cl = w - cw;
    await sharp(filePath)
      .extract({ left: cl, top: 0, width: cw, height: ch })
      .resize({ width: 350 })
      .jpeg({ quality: 85 })
      .toFile(path.join(outSub, `corner_${f}`));

    // Header crop: top 35% height
    await sharp(filePath)
      .extract({ left: 0, top: 0, width: w, height: Math.floor(h * 0.35) })
      .resize({ width: 850 })
      .jpeg({ quality: 85 })
      .toFile(path.join(outSub, `header_${f}`));

    // Full page thumbnail 500w
    await sharp(filePath)
      .resize({ width: 500 })
      .jpeg({ quality: 80 })
      .toFile(path.join(outSub, `page_${f}`));
  }
  console.log(`Done ${dosId}`);
}

async function main() {
  await cropDossier('PL_2016_16I');
  await cropDossier('PL_2016_16J');
  await cropDossier('PL_2016_16F');
  console.log('Finished cropping all Batch 2016-2 dossiers.');
}

main().catch(console.error);
