import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function checkDoubtful15H() {
  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15H';
  const outDir = 'tests/inspect_batch2015_2/15H';
  for (const f of ['041.jpg', '042.jpg', '043.jpg', '044.jpg', '045.jpg', '046.jpg', '047.jpg']) {
    await sharp(`${p}/${f}`).resize({width: 800}).toFile(`${outDir}/check_${f}`);
  }
}
checkDoubtful15H();
