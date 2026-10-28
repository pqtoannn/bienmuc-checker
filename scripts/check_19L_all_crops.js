import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function cropRest() {
  for (let i = 1; i <= 13; i++) {
    const fn = String(i).padStart(3, '0');
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19L/${fn}.jpg`;
    // header
    await sharp(p).extract({ left: 50, top: 50, width: 1200, height: 400 }).toFile(`tests/inspect_19L/${fn}_head.jpg`);
    // top right
    await sharp(p).extract({ left: 1400, top: 20, width: 500, height: 300 }).toFile(`tests/inspect_19L/${fn}_topright.jpg`);
  }
  console.log('All 13 cropped');
}

cropRest().catch(e => console.error(e));
