import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  for (const f of ['086.jpg', '087.jpg', '088.jpg', '089.jpg']) {
    await sharp(pDir + '/' + f)
      .resize({ width: 800 })
      .toFile('tests/inspect_batch2016_4/' + f.replace('.jpg', '_inspect.jpg'));
  }
  console.log('Saved 086-089 inspect');
}
main();
