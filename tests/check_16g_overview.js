import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  for (const f of ['001.jpg', '002.jpg', '003.jpg']) {
    await sharp(pDir + '/' + f)
      .resize({ width: 800 })
      .toFile('tests/inspect_batch2016_5/' + f.replace('.jpg', '_overview.jpg'));
  }
  console.log('Saved 001-003 overview');
}
main();
