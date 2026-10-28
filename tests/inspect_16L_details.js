import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function inspect16LDetails() {
  const dir = path.join(P_PHOTOS, 'PL_2016_16L');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
  for (const f of files) {
    const p = path.join(dir, f);
    const meta = await sharp(p).metadata();
    
    // Corner: let's inspect the top right and top left corners
    // Top right
    await sharp(p)
      .extract({ left: Math.floor(meta.width * 0.65), top: 0, width: Math.floor(meta.width * 0.35), height: Math.floor(meta.height * 0.25) })
      .resize({ width: 450 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT_DIR, `16L_tr_${f}`));
      
    // Header
    await sharp(p)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.40) })
      .resize({ width: 850 })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT_DIR, `16L_hd_${f}`));
  }
}
inspect16LDetails();
