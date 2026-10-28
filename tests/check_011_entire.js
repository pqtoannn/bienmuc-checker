import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

await sharp('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2016_16L/011.jpg')
  .resize({ width: 1000 })
  .toFile('d:/BG/Check_HS_BM/tests/inspect_batch2016_1/16L_entire_011.jpg');
