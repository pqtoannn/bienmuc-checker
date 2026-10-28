import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

async function inspect75_92() {
  const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2015_15D';
  const outDir = 'tests/inspect_batch2015_4/15D';

  const scans = [];
  for (let i = 75; i <= 92; i++) {
    scans.push(String(i).padStart(3, '0') + '.jpg');
  }

  const thumbs = [];
  for (const s of scans) {
    const meta = await sharp(path.join(pPhotos, s)).metadata();
    const buf = await sharp(path.join(pPhotos, s))
      .extract({
        left: Math.floor(meta.width * 0.72),
        top: 0,
        width: Math.floor(meta.width * 0.28),
        height: Math.floor(meta.height * 0.2)
      })
      .resize(180, 120, { fit: 'fill' })
      .composite([{
        input: Buffer.from(`<svg width="180" height="120"><rect x="0" y="0" width="180" height="22" fill="black"/><text x="5" y="16" fill="yellow" font-size="14" font-weight="bold">${s}</text></svg>`),
        top: 0,
        left: 0
      }])
      .toBuffer();
    thumbs.push(buf);
  }

  const cols = 6;
  const rows = Math.ceil(thumbs.length / cols);
  const canvasW = cols * 180;
  const canvasH = rows * 120;

  const composites = thumbs.map((buf, idx) => ({
    input: buf,
    left: (idx % cols) * 180,
    top: Math.floor(idx / cols) * 120
  }));

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: { r: 30, g: 30, b: 30 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'strip_75_92.jpg'));
  console.log('Saved strip_75_92.jpg');
}

inspect75_92();
