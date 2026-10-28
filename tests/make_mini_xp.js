import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeXpMontage() {
  const compList = [];
  const w = 400;
  const h = 120;
  const cols = 3;
  for (let i = 14; i <= 22; i++) {
    const fn = String(i).padStart(3, '0') + '.jpg';
    const buf = await sharp('tests/inspect_batch/PL_2021_21o/xp_' + fn).resize(w, h).toBuffer();
    const idx = i - 14;
    compList.push({ input: buf, left: (idx % cols) * w, top: Math.floor(idx / cols) * h });
  }
  await sharp({
    create: { width: cols * w, height: 3 * h, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite(compList).toFile('tests/inspect_batch/PL_2021_21o/mini_xp.jpg');
  console.log('Done mini xp');
}
makeXpMontage();
