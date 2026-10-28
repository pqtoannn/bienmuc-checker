import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20E';
const outDir = 'tests/inspect_batch/PL_2020_20E';

async function dumpViews() {
  for (let i = 2; i <= 8; i++) {
    const fn = `${String(i).padStart(3, '0')}.jpg`;
    await sharp(path.join(dDir, fn)).resize(900).toFile(path.join(outDir, `view_${fn}`));
  }
  console.log('Saved 002-008 views in 20E');
}
dumpViews();
