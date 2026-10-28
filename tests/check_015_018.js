import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function run() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16G';
  for (const f of ['015.jpg', '016.jpg', '017.jpg', '018.jpg']) {
    await sharp(pDir + '/' + f).resize({width: 800}).toFile('tests/inspect_batch2016_5/page_' + f);
  }
}
run();
