import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16H';
  for (const f of ['082.jpg', '083.jpg', '084.jpg', '085.jpg', '086.jpg']) {
    await sharp(pDir + '/' + f)
      .resize({ width: 800 })
      .toFile('tests/inspect_batch2016_4/' + f.replace('.jpg', '_small.jpg'));
  }
  console.log('Saved 082-086 small');
}
main();
