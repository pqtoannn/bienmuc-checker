import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function inspect19Q() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19Q';
  const outDir = 'tests/inspect_batch2019_8/19Q_details';
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 1; i <= 5; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = path.join(dir, `${fnStr}.jpg`);
    if (!fs.existsSync(fn)) continue;

    // Save resized full view
    await sharp(fn)
      .resize(1200, null, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, `${fnStr}_full.jpg`));

    // Save top half
    const meta = await sharp(fn).metadata();
    await sharp(fn)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.5) })
      .resize(1400, null, { fit: 'inside' })
      .jpeg({ quality: 90 })
      .toFile(path.join(outDir, `${fnStr}_top.jpg`));
  }
  console.log('19Q details generated');
}

inspect19Q().catch(console.error);
