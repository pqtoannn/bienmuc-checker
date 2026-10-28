import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function main() {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16D';
  for (const f of ['100.jpg', '101.jpg']) {
    const meta = await sharp(pDir + '/' + f).metadata();
    await sharp(pDir + '/' + f)
      .extract({
        left: Math.round(meta.width * 0.78),
        top: Math.round(meta.height * 0.05),
        width: Math.round(meta.width * 0.20),
        height: Math.round(meta.height * 0.15)
      })
      .resize({ width: 400 })
      .toFile('tests/inspect_batch2016_4/' + f.replace('.jpg', '_corner.jpg'));
  }
  console.log('Saved corners 100 and 101');
}
main();
