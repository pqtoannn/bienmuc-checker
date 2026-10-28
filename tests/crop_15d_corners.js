import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function crop15DCorners() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15D';
  const outDir = 'tests/inspect_batch2015_4/15D';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const allFiles = fs.readdirSync(pPhotos).filter(f => f.endsWith('.jpg')).sort();

  async function makeGrid(files, outName) {
    const W = 160, H = 140;
    const cols = 6;
    const rows = Math.ceil(files.length / cols);
    const canvas = sharp({
      create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
    });
    const composites = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const meta = await sharp(path.join(pPhotos, f)).metadata();
      const b = await sharp(path.join(pPhotos, f))
        .extract({
          left: Math.round(meta.width * 0.75),
          top: Math.round(meta.height * 0.04),
          width: Math.round(meta.width * 0.23),
          height: Math.round(meta.height * 0.22)
        })
        .resize(W, H)
        .toBuffer();
      composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
      const svg = Buffer.from('<svg width="' + W + '" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">' + f + '</text></svg>');
      composites.push({ input: svg, left: col * W, top: row * (H + 20) });
    }
    await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(outDir, outName));
    console.log('Saved ' + outName);
  }

  // 145 active files: 002 to 146
  // Split into 4 parts:
  // Part 1: 002 to 037 (36 files)
  // Part 2: 038 to 073 (36 files)
  // Part 3: 074 to 109 (36 files)
  // Part 4: 110 to 146 (37 files)
  await makeGrid(allFiles.slice(1, 37), 'corners_15D_part1.jpg');
  await makeGrid(allFiles.slice(37, 73), 'corners_15D_part2.jpg');
  await makeGrid(allFiles.slice(73, 109), 'corners_15D_part3.jpg');
  await makeGrid(allFiles.slice(109), 'corners_15D_part4.jpg');
}

crop15DCorners();
