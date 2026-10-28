import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16A';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function checkSpecificHeaders() {
  for (const f of ['015.jpg', '023.jpg', '024.jpg', '044.jpg', '045.jpg']) {
    const p = path.join(P_PHOTOS, f);
    const meta = await sharp(p).metadata();
    await sharp(p)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.35) })
      .resize({ width: 1000 })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16A_hd_spec_${f}`));
  }
}
checkSpecificHeaders();
