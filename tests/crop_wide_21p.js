import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

// Let's crop from left: 1100, top: 20, width: 450, height: 200 for all photos 1 to 200
async function cropWideCorners() {
  for (let i = 1; i <= 200; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    await sharp('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21p/' + fn)
      .extract({ left: 1100, top: 20, width: 450, height: 200 })
      .resize(300, 133)
      .toFile('tests/inspect_batch/PL_2021_21p/cw_' + fn);
  }
  console.log('Wide corners cropped');
}
cropWideCorners();
