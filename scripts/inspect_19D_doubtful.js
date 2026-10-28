import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19D/doubtful';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const nums = ['027', '028', '045', '046', '082', '083'];
  for (const n of nums) {
    await sharp(`C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19D/${n}.jpg`)
      .resize(1000)
      .toFile(path.join(outDir, `${n}_full.jpg`));
  }
  console.log('Saved 19D doubtful fulls');
}

main().catch(console.error);
