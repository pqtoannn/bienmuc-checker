import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21l';
const outDir = 'tests/inspect_batch/PL_2021_21l/crops_84_161';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const items = [];
  for (let i = 84; i <= 161; i++) {
    const p = String(i).padStart(3, '0') + '.jpg';
    const src = path.join(dir, p);
    if (!fs.existsSync(src)) continue;
    const buf = await sharp(src)
      .extract({ left: 1500, top: 20, width: 350, height: 200 })
      .resize(200, 110)
      .composite([{
        input: Buffer.from(`<svg width="200" height="26"><rect x="0" y="0" width="70" height="24" fill="black"/><text x="5" y="17" font-family="Arial" font-size="14" font-weight="bold" fill="yellow">${p.replace('.jpg','')}</text></svg>`),
        top: 0,
        left: 0
      }])
      .toBuffer();
    items.push({ p, buf });
  }

  // Create 2 grids: 84 to 120 and 121 to 161
  const cols = 5;
  const itemW = 200;
  const itemH = 110;

  for (let g = 0; g < 2; g++) {
    const chunk = items.slice(g * 39, (g + 1) * 39);
    const rows = Math.ceil(chunk.length / cols);
    const composites = chunk.map((item, idx) => ({
      input: item.buf,
      left: (idx % cols) * itemW,
      top: Math.floor(idx / cols) * itemH
    }));

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
    .toFile(`tests/inspect_batch/PL_2021_21l/grid_mid_${g + 1}.jpg`);
    console.log(`Saved grid_mid_${g + 1}.jpg`);
  }
}

run();
