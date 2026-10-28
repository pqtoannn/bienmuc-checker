import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16A';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function check45_46() {
  for (const f of ['045.jpg', '046.jpg']) {
    const p = path.join(P_PHOTOS, f);
    await sharp(p)
      .resize({ width: 1200 })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16A_full_${f}`));
  }
}
check45_46();
