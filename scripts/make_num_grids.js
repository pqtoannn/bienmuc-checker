import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeGrids(dossier, cropsDir, totalPhotos) {
  const photos = [];
  for (let i = 2; i <= totalPhotos; i++) {
    const name = String(i).padStart(3, '0') + '.jpg';
    photos.push(name);
  }
  const cols = 5;
  const itemW = 200;
  const itemH = 150;
  const pageSize = 35; // 5 x 7 = 35 items per page

  const numPages = Math.ceil(photos.length / pageSize);
  for (let page = 0; page < numPages; page++) {
    const pagePhotos = photos.slice(page * pageSize, (page + 1) * pageSize);
    const rows = Math.ceil(pagePhotos.length / cols);
    const gridW = cols * itemW;
    const gridH = rows * itemH;

    const composites = [];
    for (let idx = 0; idx < pagePhotos.length; idx++) {
      const p = pagePhotos[idx];
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const cropPath = path.join(cropsDir, p);
      if (fs.existsSync(cropPath)) {
        const svg = `<svg width="200" height="30"><rect x="0" y="0" width="70" height="24" fill="rgba(0,0,0,0.8)"/><text x="5" y="17" font-family="Arial" font-size="14" font-weight="bold" fill="#00FF00">${p.replace('.jpg','')}</text></svg>`;
        const buf = await sharp(cropPath)
          .composite([{
            input: Buffer.from(svg),
            top: 0,
            left: 0
          }])
          .toBuffer();
        composites.push({
          input: buf,
          left: c * itemW,
          top: r * itemH
        });
      }
    }

    const outPath = path.join('tests/inspect_batch', dossier, `num_grid_${page + 1}.jpg`);
    await sharp({
      create: {
        width: gridW,
        height: gridH,
        channels: 3,
        background: { r: 20, g: 20, b: 20 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(outPath);
    console.log(`Created ${outPath}`);
  }
}

async function run() {
  await makeGrids('PL_2021_21i', 'tests/inspect_batch/sheet_crops_21i', 143);
  await makeGrids('PL_2021_21j', 'tests/inspect_batch/sheet_crops_21j', 188);
}

run();
