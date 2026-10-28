import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const batches = [
  ['012.jpg', '017.jpg', '020.jpg', '021.jpg', '031.jpg', '032.jpg', '033.jpg', '034.jpg'],
  ['045.jpg', '046.jpg', '050.jpg', '051.jpg', '052.jpg', '053.jpg', '055.jpg', '056.jpg', '057.jpg', '058.jpg']
];

async function make21mMontages() {
  for (let bIdx = 0; bIdx < batches.length; bIdx++) {
    const list = batches[bIdx];
    const compList = [];
    const w = 450;
    const h = 130;
    const cols = 2;
    for (let i = 0; i < list.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const buf = await sharp('tests/inspect_batch/PL_2021_21m/hdr_' + list[i]).resize(w, h).toBuffer();
      compList.push({ input: buf, left: col * w, top: row * h });
    }
    await sharp({
      create: {
        width: cols * w,
        height: Math.ceil(list.length / cols) * h,
        channels: 3,
        background: { r: 50, g: 50, b: 50 }
      }
    }).composite(compList).toFile('tests/inspect_batch/PL_2021_21m/montage_21m_b' + (bIdx + 1) + '.jpg');
  }
  console.log('21m montages created');
}
make21mMontages();
