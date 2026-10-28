import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16A';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function checkDocContent() {
  for (const f of ['035.jpg', '036.jpg', '037.jpg', '038.jpg', '039.jpg']) {
    const p = path.join(P_PHOTOS, f);
    await sharp(p)
      .resize({ width: 1000 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT_DIR, `16A_page_${f}`));
  }
}
checkDocContent();
