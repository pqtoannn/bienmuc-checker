import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function checkDetails() {
  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15A';
  await sharp(`${p}/009.jpg`).extract({left: 50, top: 100, width: 600, height: 300}).toFile('tests/inspect_batch2015_1/15A/check_009.jpg');
  await sharp(`${p}/046.jpg`).extract({left: 50, top: 100, width: 600, height: 300}).toFile('tests/inspect_batch2015_1/15A/check_046.jpg');
}
checkDetails();
