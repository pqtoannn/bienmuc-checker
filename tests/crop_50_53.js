import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function crop50_53() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15D';
  const outDir = 'tests/inspect_batch2015_4/15D';

  for (let i = 50; i <= 53; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    await sharp(path.join(pPhotos, f))
      .resize(800)
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, 'full_' + f));
  }
  console.log('Exported full 50-53');
}

crop50_53();
