import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  await sharp(pDir + '/056.jpg')
    .resize({ width: 800 })
    .toFile('tests/inspect_batch2016_4/056_inspect.jpg');
  console.log('Saved 056 inspect');
}
main();
