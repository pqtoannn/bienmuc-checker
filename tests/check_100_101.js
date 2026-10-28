import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  for (const f of ['100.jpg', '101.jpg']) {
    await sharp(pDir + '/' + f)
      .resize({ width: 800 })
      .toFile('tests/inspect_batch2016_4/' + f.replace('.jpg', '_full.jpg'));
  }
  console.log('Saved 100_full and 101_full');
}
main();
