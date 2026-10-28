import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const dDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20H';
const outDir = 'tests/inspect_batch/PL_2020_20H/suspects';

async function check10() {
  await sharp(path.join(dDir, '010.jpg'))
    .resize(1000)
    .jpeg({ quality: 85 })
    .toFile(path.join(outDir, 'full_010.jpg'));
}
check10();
