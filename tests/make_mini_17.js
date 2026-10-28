import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeMini17() {
  const compList = [];
  const w = 300;
  const h = 180;
  for (let i = 17; i <= 20; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const buf = await sharp('tests/inspect_batch/PL_2021_21p/z17_' + fn).resize(w, h).toBuffer();
    compList.push({ input: buf, left: (i - 17) * w, top: 0 });
  }
  await sharp({
    create: { width: 4 * w, height: h, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite(compList).toFile('tests/inspect_batch/PL_2021_21p/mini_17_20.jpg');
}
makeMini17();
