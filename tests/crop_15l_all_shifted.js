import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function crop15LShifted() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15L';
  const outDir = 'tests/inspect_batch2015_3/15L';

  async function makeGrid(startIdx, endIdx, outName) {
    const W = 160, H = 140;
    const cols = 6;
    const count = endIdx - startIdx + 1;
    const rows = Math.ceil(count / cols);
    const canvas = sharp({
      create: { width: cols * W, height: rows * (H + 20), channels: 3, background: { r: 15, g: 15, b: 15 } }
    });
    const composites = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const f = String(i).padStart(3, '0') + '.jpg';
      const idx = i - startIdx;
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const meta = await sharp(path.join(pPhotos, f)).metadata();
      const b = await sharp(path.join(pPhotos, f))
        .extract({
          left: Math.round(meta.width * 0.65),
          top: Math.round(meta.height * 0.05),
          width: Math.round(meta.width * 0.28),
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

  // 022 to 102 (81 files)
  // Split into 3 grids:
  // Part A: 022 to 048 (27 files)
  // Part B: 049 to 075 (27 files)
  // Part C: 076 to 102 (27 files)
  await makeGrid(22, 48, 'pencils_022_048.jpg');
  await makeGrid(49, 75, 'pencils_049_075.jpg');
  await makeGrid(76, 102, 'pencils_076_102.jpg');
}

crop15LShifted();
