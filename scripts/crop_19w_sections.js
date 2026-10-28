import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function cropSection(startIdx, endIdx, prefix) {
  const outDir = `tests/inspect_batch2019_11/19W/crops_${prefix}`;
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = startIdx; i <= endIdx; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const src = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19W/${fn}`;
    if (!fs.existsSync(src)) continue;
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({ left: Math.floor(meta.width * 0.1), top: 0, width: Math.floor(meta.width * 0.88), height: Math.floor(meta.height * 0.28) })
      .resize({ width: 1100 })
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, fn));
  }
  console.log(`Cropped ${startIdx}-${endIdx} into ${outDir}`);
}

async function main() {
  await cropSection(9, 25, '9_25');
  await cropSection(26, 45, '26_45');
  await cropSection(46, 65, '46_65');
  await cropSection(66, 79, '66_79');
}

main().catch(console.error);
