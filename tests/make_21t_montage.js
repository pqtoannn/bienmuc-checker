import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function montage() {
  const dir = 'tests/inspect_batch/PL_2021_21T/crops_tr_all';
  const files = fs.readdirSync(dir).filter(f => f.startsWith('tr_')).sort();
  const cols = 3;
  const rows = Math.ceil(files.length / cols);
  const cellW = 350;
  const cellH = 150;
  
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const num = f.replace('tr_','').replace('.jpg','');
    const svg = `<svg width="${cellW}" height="${cellH}"><rect x="0" y="0" width="60" height="24" fill="black"/><text x="5" y="18" font-family="Arial" font-size="16" font-weight="bold" fill="#00FF00">${num}</text></svg>`;
    const buf = await sharp(path.join(dir, f))
      .resize(cellW, cellH, { fit: 'fill' })
      .composite([{
        input: Buffer.from(svg),
        top: 0,
        left: 0
      }])
      .toBuffer();
    composites.push({
      input: buf,
      left: (i % cols) * cellW,
      top: Math.floor(i / cols) * cellH
    });
  }
  await sharp({
    create: {
      width: cols * cellW,
      height: rows * cellH,
      channels: 3,
      background: { r: 40, g: 40, b: 40 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile('tests/inspect_batch/PL_2021_21T/montage_all_numbers.jpg');
  console.log('Saved montage_all_numbers.jpg');
}
montage();
