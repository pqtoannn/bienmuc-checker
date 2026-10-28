import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function make15AGrids() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15A';
  const outDir = 'tests/inspect_batch2015_1/15A';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  const allFiles = fs.readdirSync(pPhotos).filter(f => f.endsWith('.jpg')).sort();

  async function makeGrid(files, outName) {
    const W = 350, H = 200;
    const cols = 4;
    const rows = Math.ceil(files.length / cols);
    const canvas = sharp({
      create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
    });
    const composites = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const b = await sharp(path.join(pPhotos, f)).resize(W, H).toBuffer();
      composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
      const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
      composites.push({ input: svg, left: col * W, top: row * (H + 20) });
    }
    await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(outDir, outName));
    console.log('Saved ' + outName);
  }

  // 46 files: part1 (1-24), part2 (25-46)
  await makeGrid(allFiles.slice(0, 24), 'grid_15A_part1.jpg');
  await makeGrid(allFiles.slice(24), 'grid_15A_part2.jpg');
}

make15AGrids();
