import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21i';
const files = [
  '002.jpg', '003.jpg', '004.jpg', '005.jpg', '006.jpg', '007.jpg', '008.jpg', '009.jpg',
  '012.jpg', '013.jpg', '014.jpg', '017.jpg', '018.jpg', '019.jpg', '020.jpg', '021.jpg',
  '031.jpg', '032.jpg', '037.jpg', '053.jpg', '061.jpg', '088.jpg', '090.jpg', '096.jpg',
  '098.jpg', '102.jpg', '105.jpg', '118.jpg', '120.jpg', '132.jpg', '142.jpg', '143.jpg'
];

async function run() {
  const items = [];
  for (const f of files) {
    const src = path.join(dir, f);
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;
    // crop top left (around Số hiệu: left 0 to 45%, top 10% to 25%)
    const buf = await sharp(src)
      .extract({ left: Math.round(w * 0.05), top: Math.round(h * 0.08), width: Math.round(w * 0.45), height: Math.round(h * 0.12) })
      .resize(350, 100)
      .composite([{
        input: Buffer.from(`<svg width="350" height="25"><rect x="0" y="0" width="80" height="22" fill="black"/><text x="5" y="16" font-family="Arial" font-size="14" font-weight="bold" fill="yellow">${f.replace('.jpg','')}</text></svg>`),
        top: 0,
        left: 0
      }])
      .toBuffer();
    items.push(buf);
  }

  const cols = 4;
  const itemW = 350;
  const itemH = 100;
  const composites = items.map((buf, idx) => ({
    input: buf,
    left: (idx % cols) * itemW,
    top: Math.floor(idx / cols) * itemH
  }));

  await sharp({
    create: {
      width: cols * itemW,
      height: Math.ceil(items.length / cols) * itemH,
      channels: 3,
      background: { r: 10, g: 10, b: 10 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile('tests/inspect_batch/PL_2021_21i/check_so_hieu.jpg');
  console.log('Saved check_so_hieu.jpg');
}

run();
