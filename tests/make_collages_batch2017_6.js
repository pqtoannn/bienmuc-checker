import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const pPhotos = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const baseOut = 'tests/inspect_batch2017_6';
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
  await cropCorners('PL_2017_17E');
  await cropCorners('PL_2017_17O');

  // 17E: 002 to 108 (107 files)
  // P1: 2-23 (22), P2: 24-45 (22), P3: 46-67 (22), P4: 68-88 (21), P5: 89-108 (20)
  await makeZoomPart('PL_2017_17E', 2, 23, 'part1.jpg');
  await makeZoomPart('PL_2017_17E', 24, 45, 'part2.jpg');
  await makeZoomPart('PL_2017_17E', 46, 67, 'part3.jpg');
  await makeZoomPart('PL_2017_17E', 68, 88, 'part4.jpg');
  await makeZoomPart('PL_2017_17E', 89, 108, 'part5.jpg');

  // 17O: 002 to 119 (118 files)
  // P1: 2-25 (24), P2: 26-49 (24), P3: 50-73 (24), P4: 74-96 (23), P5: 97-119 (23)
  await makeZoomPart('PL_2017_17O', 2, 25, 'part1.jpg');
  await makeZoomPart('PL_2017_17O', 26, 49, 'part2.jpg');
  await makeZoomPart('PL_2017_17O', 50, 73, 'part3.jpg');
  await makeZoomPart('PL_2017_17O', 74, 96, 'part4.jpg');
  await makeZoomPart('PL_2017_17O', 97, 119, 'part5.jpg');
}

run().catch(console.error);
