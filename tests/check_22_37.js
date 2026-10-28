import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16A';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function check22() {
  for (const f of ['021.jpg', '022.jpg', '023.jpg', '036.jpg', '037.jpg', '038.jpg']) {
    const p = path.join(P_PHOTOS, f);
    const meta = await sharp(p).metadata();
    await sharp(p)
      .extract({ left: Math.floor(meta.width * 0.50), top: 0, width: Math.floor(meta.width * 0.50), height: Math.floor(meta.height * 0.30) })
      .resize({ width: 800 })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16A_topright_${f}`));
  }
}
check22();
