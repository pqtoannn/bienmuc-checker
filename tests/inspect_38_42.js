import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function inspect38_42() {
  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15K';
  const outDir = 'tests/inspect_batch2015_4/15K';

  for (let i = 37; i <= 43; i++) {
    const f = String(i).padStart(3, '0') + '.jpg';
    await sharp(path.join(p, f))
      .resize(800)
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, 'full_' + f));
  }
  console.log('Exported full 37-43');
}

inspect38_42();
