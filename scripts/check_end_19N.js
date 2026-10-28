import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function checkEnd19N() {
  for (let i = 205; i <= 211; i++) {
    const fn = String(i).padStart(3, '0');
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19N/${fn}.jpg`;
    await sharp(p).extract({ left: 1450, top: 10, width: 450, height: 250 }).resize(300).toFile(`tests/inspect_19N/${fn}_p.jpg`);
    await sharp(p).extract({ left: 100, top: 100, width: 1000, height: 350 }).resize(400).toFile(`tests/inspect_19N/${fn}_h.jpg`);
  }
  console.log('Saved end 19N crops');
}

checkEnd19N().catch(e => console.error(e));
