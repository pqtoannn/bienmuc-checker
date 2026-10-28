import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function testSideBySide() {
  for (const fn of ['002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013']) {
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19L/${fn}.jpg`;
    if (!fs.existsSync(p)) continue;

    // left half
    await sharp(p).extract({ left: 100, top: 50, width: 850, height: 950 }).resize(300).toFile(`tests/inspect_19L/${fn}_L.jpg`);
    // right half
    await sharp(p).extract({ left: 950, top: 50, width: 850, height: 950 }).resize(300).toFile(`tests/inspect_19L/${fn}_R.jpg`);
  }
  console.log('Saved L and R halves');
}

testSideBySide().catch(e => console.error(e));
