import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  for (const f of ['100.jpg', '101.jpg']) {
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: 0,
        top: Math.round(meta.height * 0.70),
        width: meta.width,
        height: Math.round(meta.height * 0.30)
      })
      .resize({ width: 800 })
      .toFile('tests/inspect_batch2016_4/' + f.replace('.jpg', '_very_bottom.jpg'));
  }
  console.log('Saved very bottoms');
}
main();
