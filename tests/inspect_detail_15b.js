import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function inspectDetail() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15B';
  const outDir = 'tests/inspect_batch2015_1/15B';
  for (const f of ['003.jpg', '005.jpg', '013.jpg', '014.jpg', '016.jpg']) {
    await sharp(`${pPhotos}/${f}`).resize({width: 900}).toFile(`${outDir}/detail_${f}`);
  }
}
inspectDetail();
