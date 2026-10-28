import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeSheetMontage() {
  const list = [76, 77, 78, 79, 80, 81, 82, 90, 91, 92, 93, 94];
  const compList = [];
  const w = 350;
  const h = 250;
  const cols = 4;
  for (let i = 0; i < list.length; i++) {
    const fn = String(list[i]).padStart(3, '0') + '.jpg';
    const buf = await sharp('tests/inspect_batch/PL_2021_21n/sheet_' + fn).toBuffer();
    compList.push({ input: buf, left: (i % cols) * w, top: Math.floor(i / cols) * h });
  }
  await sharp({
    create: {
      width: cols * w,
      height: Math.ceil(list.length / cols) * h,
      channels: 3,
      background: { r: 30, g: 30, b: 30 }
    }
  }).composite(compList).toFile('tests/inspect_batch/PL_2021_21n/sheet_montage_verify.jpg');
  console.log('Montage created');
}
makeSheetMontage();
