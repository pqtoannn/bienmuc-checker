import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16A';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function checkDoubtful() {
  for (const f of ['019.jpg', '020.jpg', '021.jpg', '022.jpg', '026.jpg', '027.jpg', '028.jpg', '045.jpg', '046.jpg']) {
    const p = path.join(P_PHOTOS, f);
    const meta = await sharp(p).metadata();
    
    // Zoom corner
    const cw = Math.floor(meta.width * 0.25);
    const ch = Math.floor(meta.height * 0.15);
    const cl = meta.width - cw;
    await sharp(p)
      .extract({ left: cl, top: 0, width: cw, height: ch })
      .resize({ width: 400 })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16A_zoom_c_${f}`));

    // Zoom doc info (left side of header: doc num and title)
    const dw = Math.floor(meta.width * 0.6);
    const dh = Math.floor(meta.height * 0.3);
    await sharp(p)
      .extract({ left: 0, top: 0, width: dw, height: dh })
      .resize({ width: 700 })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT_DIR, `16A_zoom_d_${f}`));
  }
}

checkDoubtful();
