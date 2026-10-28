import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16I';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_2';

async function checkEnd16I() {
  for (let i = 45; i <= 50; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    const p = path.join(P_PHOTOS, f);
    await sharp(p)
      .resize(1000)
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16I_full_${f}`));
  }
}
checkEnd16I();
