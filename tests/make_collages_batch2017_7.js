import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const baseOut = 'tests/inspect_batch2017_7';
if (!fs.existsSync(baseOut)) fs.mkdirSync(baseOut, { recursive: true });

async function cropCorners(dos) {
  const dosDir = path.join(pPhotos, dos);
  const files = fs.readdirSync(dosDir).filter(f => f.endsWith('.jpg')).sort();
  const dosOut = path.join(baseOut, dos);
  if (!fs.existsSync(dosOut)) fs.mkdirSync(dosOut, { recursive: true });

  for (const f of files) {
    const src = path.join(dosDir, f);
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;

    await sharp(src)
      .extract({ left: Math.floor(w * 0.70), top: 0, width: Math.floor(w * 0.30), height: Math.floor(h * 0.22) })
      .resize(250)
      .toFile(path.join(dosOut, 'tr_' + f));
  }
  console.log(`Cropped corners for ${dos}`);
}

async function makeZoomPart(dos, start, end, outName, cols = 6) {
  const dir = path.join(baseOut, dos);
  const files = [];
  for (let i = start; i <= end; i++) files.push('tr_' + String(i).padStart(3, '0') + '.jpg');
  const thumbs = [];
  for (const f of files) {
    const p = path.join(dir, f);
    const b = await sharp(p).resize(200).toBuffer();
    thumbs.push(b);
  }
  const cellW = 200;
  const cellH = 140;
  const numRows = Math.ceil(thumbs.length / cols);
  const composites = [];
  thumbs.forEach((b, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    composites.push({ input: b, left: c * cellW, top: r * (cellH + 5) });
  });
  await sharp({
    create: { width: cols * cellW, height: numRows * (cellH + 5), channels: 3, background: { r: 255, g: 255, b: 255 } }
  }).composite(composites).jpeg({ quality: 90 }).toFile(path.join(dir, outName));
  console.log(`Saved ${dos}/${outName}`);
}

async function run() {
  await cropCorners('PL_2017_17I');
  await cropCorners('PL_2017_17F');

  // 17I: 002 to 126 (125 files)
  await makeZoomPart('PL_2017_17I', 2, 26, 'part1.jpg');
  await makeZoomPart('PL_2017_17I', 27, 51, 'part2.jpg');
  await makeZoomPart('PL_2017_17I', 52, 76, 'part3.jpg');
  await makeZoomPart('PL_2017_17I', 77, 101, 'part4.jpg');
  await makeZoomPart('PL_2017_17I', 102, 126, 'part5.jpg');

  // 17F: 002 to 139 (138 files)
  await makeZoomPart('PL_2017_17F', 2, 24, 'part1.jpg');
  await makeZoomPart('PL_2017_17F', 25, 47, 'part2.jpg');
  await makeZoomPart('PL_2017_17F', 48, 70, 'part3.jpg');
  await makeZoomPart('PL_2017_17F', 71, 93, 'part4.jpg');
  await makeZoomPart('PL_2017_17F', 94, 116, 'part5.jpg');
  await makeZoomPart('PL_2017_17F', 117, 139, 'part6.jpg');
}

run().catch(console.error);
