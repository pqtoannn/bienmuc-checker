import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const outDir = 'tests/inspect_batch2016_5/16G';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(pDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Re-extracting corners for ${files.length} images for 16G...`);

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const inPath = path.join(pDir, f);
    const meta = await sharp(inPath).metadata();

    // Exact top-right corner where pencil number is
    await sharp(inPath)
      .extract({
        left: Math.round(meta.width * 0.78),
        top: Math.round(meta.height * 0.20),
        width: Math.round(meta.width * 0.21),
        height: Math.round(meta.height * 0.22)
      })
      .resize({ width: 300 })
      .toFile(path.join(outDir, 'corner_' + f));

    if ((i + 1) % 40 === 0) console.log(`Extracted ${i + 1}/${files.length}`);
  }
  console.log('Done re-extracting corners for 16G');
}
main();
