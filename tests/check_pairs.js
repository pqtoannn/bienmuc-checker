import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function checkPairs() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  const list = ['052.jpg', '053.jpg', '055.jpg', '056.jpg', '142.jpg', '143.jpg', '147.jpg', '148.jpg'];
  for (const f of list) {
    await sharp(pDir + '/' + f).resize({width: 800}).toFile('tests/inspect_batch2016_5/pair_' + f);
  }
  console.log('Saved pairs');
}
checkPairs();
