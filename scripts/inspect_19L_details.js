import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function inspect19L() {
  // Let's crop each photo's pencil number and top header
  for (let i = 1; i <= 13; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19L/${fnStr}.jpg`;
    if (!fs.existsSync(fn)) continue;

    // header
    await sharp(fn)
      .extract({ left: 100, top: 80, width: 1100, height: 350 })
      .resize(500)
      .toFile(`tests/inspect_19L/${fnStr}_header.jpg`);

    // pencil mark
    await sharp(fn)
      .extract({ left: 1450, top: 20, width: 450, height: 250 })
      .resize(300)
      .toFile(`tests/inspect_19L/${fnStr}_pencil.jpg`);
  }
  console.log('Saved all 13 crops for 19L');
}

inspect19L().catch(e => console.error(e));
