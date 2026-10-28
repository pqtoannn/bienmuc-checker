import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

async function crop15HDoubtful() {
  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15H';
  const outDir = 'tests/inspect_batch2015_2/15H_doubtful';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

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
      const b = await sharp(path.join(p, f)).resize(W, H).toBuffer();
      composites.push({ input: b, left: col * W, top: row * (H + 20) + 20 });
      const svg = Buffer.from(`<svg width="${W}" height="20"><text x="5" y="15" font-size="14" fill="#ffff00" font-family="sans-serif">${f}</text></svg>`);
      composites.push({ input: svg, left: col * W, top: row * (H + 20) });
    }
    await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(outDir, outName));
    console.log('Saved ' + outName);
  }

  await makeGrid(['007.jpg', '008.jpg', '009.jpg', '010.jpg', '011.jpg', '012.jpg', '013.jpg', '014.jpg'], 'grid_007_014.jpg');
  await makeGrid(['015.jpg', '016.jpg', '017.jpg', '018.jpg', '019.jpg', '020.jpg', '021.jpg', '022.jpg'], 'grid_015_022.jpg');
  await makeGrid(['028.jpg', '029.jpg', '030.jpg', '031.jpg', '032.jpg', '033.jpg', '034.jpg', '035.jpg'], 'grid_028_035.jpg');
}

crop15HDoubtful();
