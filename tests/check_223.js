import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20D';
const outDir = 'tests/inspect_batch/PL_2020_20D';

async function check223() {
  await sharp(path.join(dDir, '223.jpg'))
    .resize(900)
    .toFile(path.join(outDir, 'sample_223.jpg'));
  console.log('Saved 223');
}

check223();
