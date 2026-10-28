import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_1';

async function collageHD() {
  const items = [];
  for (let i = 2; i <= 11; i++) {
    const fStr = String(i).padStart(3, '0') + '.jpg';
    const p = path.join(OUT_DIR, `16L_hd_${fStr}`);
    const b = await sharp(p).resize({ width: 450, height: 200, fit: 'inside' }).toBuffer();
    const meta = await sharp(b).metadata();
    const lbl = Buffer.from(
      `<svg width="${meta.width}" height="24"><rect width="${meta.width}" height="24" fill="#1e293b"/><text x="5" y="17" font-size="14" fill="#38bdf8" font-family="sans-serif">16L - ${fStr}</text></svg>`
    );
    const cell = await sharp({
      create: { width: meta.width, height: meta.height + 25, channels: 3, background: { r: 240, g: 240, b: 240 } }
    }).composite([
      { input: lbl, left: 0, top: 0 },
      { input: b, left: 0, top: 24 }
    ]).jpeg().toBuffer();
    items.push(cell);
  }

  const cols = 2;
  const numRows = Math.ceil(items.length / cols);
  const composites = items.map((it, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    return { input: it, left: c * 460, top: r * 230 };
  });

  await sharp({
    create: { width: cols * 460, height: numRows * 230, channels: 3, background: { r: 220, g: 220, b: 220 } }
  }).composite(composites).jpeg().toFile(path.join(OUT_DIR, '16L_hd_collage.jpg'));
  console.log('Saved 16L_hd_collage.jpg');
}
collageHD();
