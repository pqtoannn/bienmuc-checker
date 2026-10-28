import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'tests/inspect_batch2016_4';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function cropDossier(dosId) {
  const dosDir = path.join(P_PHOTOS, dosId);
  const outDosDir = path.join(OUT_DIR, dosId);
  if (!fs.existsSync(outDosDir)) {
    fs.mkdirSync(outDosDir, { recursive: true });
  }

  const files = fs.readdirSync(dosDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Cropping ${dosId}: ${files.length} files...`);

  for (const f of files) {
    if (f === '001.jpg') continue;
    const fPath = path.join(dosDir, f);
    const meta = await sharp(fPath).metadata();
    const w = meta.width;
    const h = meta.height;

    // Header crop (focus on agency, number, date, subject)
    const headerLeft = Math.round(w * 0.10);
    const headerTop = Math.round(h * 0.16);
    const headerWidth = Math.round(w * 0.82);
    const headerHeight = Math.round(h * 0.30);

    await sharp(fPath)
      .extract({ left: headerLeft, top: headerTop, width: headerWidth, height: headerHeight })
      .resize({ width: 700 })
      .jpeg({ quality: 80 })
      .toFile(path.join(outDosDir, `header_${f}`));

    // Corner crop (focus on top right sheet number)
    const cornerLeft = Math.round(w * 0.74);
    const cornerTop = Math.round(h * 0.05);
    const cornerWidth = Math.round(w * 0.24);
    const cornerHeight = Math.round(h * 0.18);

    await sharp(fPath)
      .extract({ left: cornerLeft, top: cornerTop, width: cornerWidth, height: cornerHeight })
      .resize({ width: 250 })
      .jpeg({ quality: 80 })
      .toFile(path.join(outDosDir, `corner_${f}`));
  }
  console.log(`Done cropping ${dosId}`);
}

async function run() {
  await cropDossier('PL_2016_16H');
  await cropDossier('PL_2016_16D');
}
run();
