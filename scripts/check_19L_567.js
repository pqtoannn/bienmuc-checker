import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function check567() {
  for (const fn of ['005', '006', '007']) {
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19L/${fn}.jpg`;
    // header
    await sharp(p).extract({ left: 50, top: 50, width: 1200, height: 400 }).toFile(`tests/inspect_19L/${fn}_head.jpg`);
    // top right
    await sharp(p).extract({ left: 1400, top: 20, width: 500, height: 300 }).toFile(`tests/inspect_19L/${fn}_topright.jpg`);
    // footer
    await sharp(p).extract({ left: 1000, top: 600, width: 850, height: 450 }).toFile(`tests/inspect_19L/${fn}_foot.jpg`);
  }
  console.log('5, 6, 7 cropped');
}

check567().catch(e => console.error(e));
