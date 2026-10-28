import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const batches = [
  ['002.jpg', '005.jpg', '006.jpg', '007.jpg', '016.jpg', '017.jpg', '021.jpg', '022.jpg'],
  ['024.jpg', '025.jpg', '026.jpg', '029.jpg', '033.jpg', '034.jpg', '036.jpg', '037.jpg'],
  ['040.jpg', '044.jpg', '051.jpg', '053.jpg', '055.jpg', '056.jpg', '057.jpg', '059.jpg'],
  ['060.jpg', '061.jpg', '062.jpg', '063.jpg', '066.jpg', '069.jpg', '070.jpg', '074.jpg'],
  ['075.jpg', '076.jpg', '081.jpg', '082.jpg', '085.jpg', '088.jpg', '092.jpg', '093.jpg']
];

async function makeMontages() {
  for (let bIdx = 0; bIdx < batches.length; bIdx++) {
    const list = batches[bIdx];
    const compList = [];
    const w = 450;
    const h = 130;
    const cols = 2;
    for (let i = 0; i < list.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const buf = await sharp('tests/inspect_batch/PL_2021_21n/hdr_' + list[i]).resize(w, h).toBuffer();
      compList.push({ input: buf, left: col * w, top: row * h });
    }
    await sharp({
      create: {
        width: cols * w,
        height: Math.ceil(list.length / cols) * h,
        channels: 3,
        background: { r: 50, g: 50, b: 50 }
      }
    }).composite(compList).toFile('tests/inspect_batch/PL_2021_21n/montage_b' + (bIdx + 1) + '.jpg');
  }
  console.log('Montages created');
}
makeMontages();
