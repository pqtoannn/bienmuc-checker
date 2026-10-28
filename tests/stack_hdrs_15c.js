import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function stackHdrs() {
  const dir = 'tests/inspect_batch2015_2/15C';
  const files = ['hdr_012.jpg', 'hdr_016.jpg', 'hdr_070.jpg', 'hdr_071.jpg', 'hdr_072.jpg'];
  const W = 800, H = 200;
  const canvas = sharp({
    create: { width: W, height: files.length * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
  });
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const b = await sharp(path.join(dir, f)).resize(W, H).toBuffer();
    composites.push({ input: b, left: 0, top: i * (H + 20) + 20 });
    const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="10" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
    composites.push({ input: svg, left: 0, top: i * (H + 20) });
  }
  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(dir, 'stack_hdrs.jpg'));
  console.log('Saved stack_hdrs.jpg');
}
stackHdrs();
