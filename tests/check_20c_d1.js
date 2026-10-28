import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const cDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2020_20C';
const outDir = 'tests/inspect_batch/PL_2020_20C/check_names';

async function cropD1() {
  const list = ['009.jpg', '010.jpg', '011.jpg', '012.jpg', '018.jpg'];
  for (const fn of list) {
    const src = path.join(cDir, fn);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .extract({
        left: 0,
        top: Math.floor(meta.height * 0.65),
        width: meta.width,
        height: Math.floor(meta.height * 0.25)
      })
      .resize(1000)
      .toFile(path.join(outDir, `d1_${fn}`));
  }
  console.log('Saved d1 crops');
}

cropD1();
