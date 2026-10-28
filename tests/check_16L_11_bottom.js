import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function check11Bottom() {
  const p = path.join(P_PHOTOS, 'PL_2016_16L', '011.jpg');
  const meta = await sharp(p).metadata();
  await sharp(p)
    .extract({ left: 0, top: Math.floor(meta.height * 0.5), width: meta.width, height: Math.floor(meta.height * 0.5) })
    .resize({ width: 1000 })
    .toFile(path.join(OUT_DIR, '16L_bottom_011.jpg'));
}
check11Bottom();
