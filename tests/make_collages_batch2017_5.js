import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import path from 'path';

const baseOut = 'tests/inspect_batch2017_5';

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
  // 17N: 002 to 091 (90 files)
  await makeZoomPart('PL_2017_17N', 2, 24, 'part1.jpg');
  await makeZoomPart('PL_2017_17N', 25, 47, 'part2.jpg');
  await makeZoomPart('PL_2017_17N', 48, 69, 'part3.jpg');
  await makeZoomPart('PL_2017_17N', 70, 91, 'part4.jpg');

  // 17Q: 002 to 095 (94 files)
  await makeZoomPart('PL_2017_17Q', 2, 25, 'part1.jpg');
  await makeZoomPart('PL_2017_17Q', 26, 49, 'part2.jpg');
  await makeZoomPart('PL_2017_17Q', 50, 72, 'part3.jpg');
  await makeZoomPart('PL_2017_17Q', 73, 95, 'part4.jpg');
}

run().catch(console.error);
