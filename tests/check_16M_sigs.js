import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function checkSigs() {
  for (const f of ['007.jpg', '008.jpg']) {
    const p = path.join(P_PHOTOS, 'PL_2016_16M', f);
    const meta = await sharp(p).metadata();
    await sharp(p)
      .extract({ left: 0, top: Math.floor(meta.height * 0.6), width: meta.width, height: Math.floor(meta.height * 0.4) })
      .resize({ width: 800 })
      .toFile(path.join(OUT_DIR, `16M_sigs_${f}`));
  }
}
checkSigs();
