import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const P_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function makePageOverviews(dosId, count) {
  const dosDir = path.join(P_PHOTOS, dosId);
  const subDir = path.join(OUT_DIR, dosId);
  if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });

  for (let i = 1; i <= count; i++) {
    const fStr = String(i).padStart(3, '0') + '.jpg';
    const filePath = path.join(dosDir, fStr);
    if (fs.existsSync(filePath)) {
      await sharp(filePath)
        .resize({ width: 600 })
        .jpeg({ quality: 80 })
        .toFile(path.join(subDir, `page_${fStr}`));
    }
  }
  console.log(`Generated page overviews for ${dosId}`);
}

async function main() {
  await makePageOverviews('PL_2016_16M', 8);
  await makePageOverviews('PL_2016_16L', 11);
  // for 16A, let's also do it
  await makePageOverviews('PL_2016_16A', 46);
}

main().catch(console.error);
