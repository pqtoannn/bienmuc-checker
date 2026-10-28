import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function crop19R() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R';
  const outDir = 'tests/inspect_batch2019_8/19R_details';
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 1; i <= 34; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = path.join(dir, `${fnStr}.jpg`);
    if (!fs.existsSync(fn)) continue;

    const meta = await sharp(fn).metadata();
    const W = meta.width;
    const H = meta.height;

    // Header crop (top 35%, left 70%)
    await sharp(fn)
      .extract({ left: 0, top: 0, width: Math.round(W * 0.75), height: Math.round(H * 0.35) })
      .resize(900, null, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, `${fnStr}_header.jpg`));

    // Pencil crop (top right: left 70% to 100%, top 0 to 20%)
    await sharp(fn)
      .extract({ left: Math.round(W * 0.70), top: 0, width: Math.round(W * 0.30), height: Math.round(H * 0.20) })
      .resize(400, null, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, `${fnStr}_pencil.jpg`));

    // Footer crop (bottom 25%)
    await sharp(fn)
      .extract({ left: 0, top: Math.round(H * 0.75), width: W, height: Math.round(H * 0.25) })
      .resize(900, null, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toFile(path.join(outDir, `${fnStr}_footer.jpg`));
  }

  console.log('19R detail crops completed!');
}

crop19R().catch(console.error);
