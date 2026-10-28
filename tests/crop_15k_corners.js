import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';
import fs from 'fs';

async function makeGrids15K() {
  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15K';
  const outDir = 'tests/inspect_batch2015_4/15K';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(p).filter(f => f.endsWith('.jpg') && f !== '001.jpg').sort();
  const chunk = 38;

  for (let c = 0; c < 5; c++) {
    const slice = files.slice(c * chunk, (c + 1) * chunk);
    if (slice.length === 0) break;
    const thumbs = [];
    for (const f of slice) {
      const meta = await sharp(path.join(p, f)).metadata();
      const buf = await sharp(path.join(p, f))
        .extract({
          left: Math.floor(meta.width * 0.75),
          top: 0,
          width: Math.floor(meta.width * 0.25),
          height: Math.floor(meta.height * 0.25)
        })
        .resize(160, 120, { fit: 'fill' })
        .composite([{
          input: Buffer.from(`<svg width="160" height="120"><rect x="0" y="0" width="160" height="20" fill="black"/><text x="5" y="15" fill="yellow" font-size="13" font-weight="bold" font-family="sans-serif">${f}</text></svg>`),
          top: 0,
          left: 0
        }])
        .toBuffer();
      thumbs.push(buf);
    }

    const cols = 6;
    const rows = Math.ceil(thumbs.length / cols);
    const canvasW = cols * 160;
    const canvasH = rows * 120;

    const composites = thumbs.map((buf, idx) => ({
      input: buf,
      left: (idx % cols) * 160,
      top: Math.floor(idx / cols) * 120
    }));

    await sharp({
      create: {
        width: canvasW,
        height: canvasH,
        channels: 3,
        background: { r: 40, g: 40, b: 40 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(path.join(outDir, `corners_15K_part${c + 1}.jpg`));
    console.log(`Saved corners_15K_part${c + 1}.jpg`);
  }
}

makeGrids15K();
