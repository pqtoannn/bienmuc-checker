import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function check009Date() {
  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15A';
  await sharp(`${p}/009.jpg`).extract({left: 100, top: 400, width: 900, height: 300}).toFile('tests/inspect_batch2015_1/15A/check_009_bottom.jpg');
}
check009Date();
