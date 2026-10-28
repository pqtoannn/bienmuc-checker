import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const OUT_DIR = 'd:/BG/Check_HS_BM/tests/inspect_batch2016_2';

async function collageCr16I() {
  const files = ['006.jpg', '007.jpg', '008.jpg', '009.jpg', '010.jpg', '013.jpg', '038.jpg', '039.jpg', '040.jpg'];
  const items = [];
  for (const f of files) {
    const p = path.join(OUT_DIR, `16I_cr_${f}`);
    const b = await sharp(p).resize({ width: 250, height: 160, fit: 'inside' }).toBuffer();
    const meta = await sharp(b).metadata();
    const lbl = Buffer.from(
      `<svg width="${meta.width}" height="22"><rect width="${meta.width}" height="22" fill="#0f172a"/><text x="5" y="16" font-size="13" fill="#38bdf8" font-family="sans-serif">16I - ${f}</text></svg>`
    );
    const cell = await sharp({
      create: { width: meta.width, height: meta.height + 22, channels: 3, background: { r: 240, g: 240, b: 240 } }
    }).composite([
      { input: lbl, left: 0, top: 0 },
      { input: b, left: 0, top: 22 }
    ]).jpeg().toBuffer();
    items.push(cell);
  }

  const cols = 3;
  const numRows = Math.ceil(items.length / cols);
  const composites = items.map((it, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    return { input: it, left: c * 260, top: r * 190 };
  });

  await sharp({
    create: { width: cols * 260, height: numRows * 190, channels: 3, background: { r: 220, g: 220, b: 220 } }
  }).composite(composites).jpeg().toFile(path.join(OUT_DIR, '16I_cr_doubtful.jpg'));
  console.log('Saved 16I_cr_doubtful.jpg');
}
collageCr16I();
