import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function checkBottom() {
  const src = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21Z/007.jpg';
  const meta = await sharp(src).metadata();
  await sharp(src)
    .extract({
      left: 0,
      top: Math.floor(meta.height * 0.5),
      width: meta.width,
      height: Math.floor(meta.height * 0.5)
    })
    .resize(1000)
    .toFile('tests/inspect_batch/PL_2021_21Z/details/bottom_007.jpg');
  console.log('Cropped bottom of 007');
}
checkBottom();
