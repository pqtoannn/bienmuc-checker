import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function cropDetailed19L() {
  for (let i = 1; i <= 13; i++) {
    const fnStr = String(i).padStart(3, '0');
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19L/${fnStr}.jpg`;
    if (!fs.existsSync(p)) continue;

    // Full resize preview
    await sharp(p).resize(1000).toFile(`tests/inspect_19L/${fnStr}_preview.jpg`);
  }
  console.log('Saved 13 previews of 19L');
}

cropDetailed19L().catch(e => console.error(e));
