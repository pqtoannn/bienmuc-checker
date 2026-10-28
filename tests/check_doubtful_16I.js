import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16I';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_2';

async function checkDoubtful16I() {
  for (const f of ['006.jpg', '007.jpg', '008.jpg', '009.jpg', '010.jpg', '013.jpg', '038.jpg', '039.jpg', '040.jpg']) {
    const p = path.join(P_PHOTOS, f);
    const meta = await sharp(p).metadata();
    await sharp(p)
      .extract({ left: Math.floor(meta.width * 0.65), top: 0, width: Math.floor(meta.width * 0.35), height: Math.floor(meta.height * 0.25) })
      .resize({ width: 500 })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16I_cr_${f}`));
  }
}
checkDoubtful16I();
