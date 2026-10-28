import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function cropDetails104_118() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19G';
  for (let i = 104; i <= 117; i++) {
    const fn = path.join(dir, String(i).padStart(3, '0') + '.jpg');
    // Crop title + author area (y: 15% to 50%)
    await sharp(fn).extract({
      left: 100,
      top: 150,
      width: 1700,
      height: 700
    }).resize(800, null).toFile(`tests/inspect_19G/info_${i}.jpg`);
  }
  console.log('Crops 104-117 saved');
}

cropDetails104_118().catch(console.error);
