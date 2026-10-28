import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function check10_11() {
  for (const f of ['010.jpg', '011.jpg']) {
    const p = path.join(P_PHOTOS, 'PL_2016_16L', f);
    await sharp(p)
      .resize({ width: 1200 })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16L_full_${f}`));
  }
}
check10_11();
