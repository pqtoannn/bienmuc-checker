import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19B/doubtful';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function inspectList(nums) {
  for (const num of nums) {
    const fnStr = String(num).padStart(3, '0');
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19B/${fnStr}.jpg`;
    await sharp(fn)
      .extract({ left: 1100, top: 0, width: 750, height: 300 })
      .toFile(path.join(outDir, `${fnStr}_tr_wide.jpg`));
  }
  console.log('Saved doubtful crops');
}

// 014, 015, 016, 022, 023, 024, 034, 035, 053, 054, 055, 088
inspectList([14, 15, 16, 22, 23, 24, 34, 35, 53, 54, 55, 88]).catch(console.error);
