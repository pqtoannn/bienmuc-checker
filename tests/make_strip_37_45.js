import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function strip() {
  const dir = 'tests/inspect_batch2015_4/15K';
  const scans = ['037', '038', '039', '040', '041', '042', '043', '044', '045'];
  const thumbs = [];
  for (const s of scans) {
    const f = 'zoom_' + s + '.jpg';
    const buf = await sharp(path.join(dir, f))
      .resize(250, 150, { fit: 'fill' })
      .composite([{
        input: Buffer.from(`<svg width="250" height="150"><rect x="0" y="0" width="250" height="25" fill="black"/><text x="5" y="18" fill="yellow" font-size="16" font-weight="bold">${s}.jpg</text></svg>`),
        top: 0,
        left: 0
      }])
      .toBuffer();
    thumbs.push(buf);
  }

  const cols = 3;
  const rows = 3;
  const canvasW = cols * 250;
  const canvasH = rows * 150;

  const composites = thumbs.map((buf, idx) => ({
    input: buf,
    left: (idx % cols) * 250,
    top: Math.floor(idx / cols) * 150
  }));

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(dir, 'strip_37_45.jpg'));
  console.log('Saved strip_37_45.jpg');
}

strip();
