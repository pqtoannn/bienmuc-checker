import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function cropAll21T() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21T';
  const outDir = 'tests/inspect_batch/PL_2021_21T/crops_tr_all';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
  for (const f of files) {
    const meta = await sharp(path.join(dir, f)).metadata();
    await sharp(path.join(dir, f))
      .extract({ left: Math.round(meta.width * 0.7), top: 0, width: Math.round(meta.width * 0.3), height: Math.round(meta.height * 0.16) })
      .resize(400, 200, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .toFile(path.join(outDir, 'tr_' + f));
  }
  console.log('Saved all 21 top-right crops for PL_2021_21T');
}
cropAll21T();
