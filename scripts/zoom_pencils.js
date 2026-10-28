import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function zoomPencils() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R';
  const outDir = 'tests/inspect_batch2019_8/19R_zoom';
  fs.mkdirSync(outDir, { recursive: true });

  const checkList = [3, 4, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];

  for (const n of checkList) {
    const fnStr = String(n).padStart(3, '0');
    const fn = path.join(dir, `${fnStr}.jpg`);
    const meta = await sharp(fn).metadata();
    const W = meta.width;
    const H = meta.height;

    // Crop top right corner around pencil
    await sharp(fn)
      .extract({
        left: Math.round(W * 0.82),
        top: Math.round(H * 0.01),
        width: Math.round(W * 0.17),
        height: Math.round(H * 0.15)
      })
      .resize(400, null, { fit: 'inside' })
      .jpeg({ quality: 95 })
      .toFile(path.join(outDir, `${fnStr}_pencil_zoom.jpg`));
  }
  console.log('Saved pencil zooms!');
}

zoomPencils().catch(console.error);
