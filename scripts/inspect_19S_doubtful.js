import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function inspect19SDoubtful() {
  const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19S';
  const outDir = 'tests/inspect_batch2019_9/19S_check';
  fs.mkdirSync(outDir, { recursive: true });

  for (let n = 46; n <= 50; n++) {
    const fnStr = String(n).padStart(3, '0');
    const p = path.join(dir, `${fnStr}.jpg`);
    await sharp(p).resize(1200).toFile(path.join(outDir, `${fnStr}_full.jpg`));

    const meta = await sharp(p).metadata();
    await sharp(p)
      .extract({
        left: Math.round(meta.width * 0.70),
        top: 0,
        width: Math.round(meta.width * 0.30),
        height: Math.round(meta.height * 0.25)
      })
      .resize(400)
      .toFile(path.join(outDir, `${fnStr}_pencil.jpg`));
  }
  console.log('Saved 46-50 check');
}

inspect19SDoubtful().catch(console.error);
