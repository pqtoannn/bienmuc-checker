import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19G';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function checkSample() {
  const samples = ['029', '030', '050', '080', '100', '118'];
  for (const fn of samples) {
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19G/${fn}.jpg`;
    if (fs.existsSync(p)) {
      await sharp(p).resize(600).toFile(path.join(outDir, `${fn}_sample.jpg`));
    }
  }
  console.log('Saved samples');
}

checkSample();
