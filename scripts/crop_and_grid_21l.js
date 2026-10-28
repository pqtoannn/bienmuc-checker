import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21l';
const outDir = 'tests/inspect_batch/sheet_crops_21l';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const photos = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
  console.log('Photos in 21l:', photos.length);

  for (let i = 1; i <= 316; i++) {
    const p = String(i).padStart(3, '0') + '.jpg';
    const src = path.join(dir, p);
    if (!fs.existsSync(src)) continue;
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;
    // top right of paper: left 75% to 95%, top 10% to 25%
    await sharp(src)
      .extract({ left: Math.round(w * 0.75), top: Math.round(h * 0.10), width: Math.round(w * 0.22), height: Math.round(h * 0.15) })
      .resize(220, 110)
      .composite([{
        input: Buffer.from(`<svg width="220" height="26"><rect x="0" y="0" width="70" height="24" fill="black"/><text x="5" y="17" font-family="Arial" font-size="14" font-weight="bold" fill="yellow">${p.replace('.jpg','')}</text></svg>`),
        top: 0,
        left: 0
      }])
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, p));
  }
  console.log('Extracted sheet crops for 21l');

  // Now create montage grids of 35 items (5 cols x 7 rows)
  const cols = 5;
  const itemW = 220;
  const itemH = 110;
  const pageSize = 35;
  const activePhotos = [];
  for (let i = 2; i <= 316; i++) activePhotos.push(String(i).padStart(3, '0') + '.jpg');

  const numPages = Math.ceil(activePhotos.length / pageSize);
  for (let page = 0; page < numPages; page++) {
    const pagePhotos = activePhotos.slice(page * pageSize, (page + 1) * pageSize);
    const rows = Math.ceil(pagePhotos.length / cols);
    const composites = [];

    for (let idx = 0; idx < pagePhotos.length; idx++) {
      const p = pagePhotos[idx];
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const cropPath = path.join(outDir, p);
      if (fs.existsSync(cropPath)) {
        composites.push({
          input: cropPath,
          left: c * itemW,
          top: r * itemH
        });
      }
    }

    const gridPath = path.join('tests/inspect_batch/PL_2021_21l', `sheet_grid_${page + 1}.jpg`);
    await sharp({
      create: {
        width: cols * itemW,
        height: rows * itemH,
        channels: 3,
        background: { r: 20, g: 20, b: 20 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(gridPath);
    console.log(`Saved ${gridPath}`);
  }
}

run();
