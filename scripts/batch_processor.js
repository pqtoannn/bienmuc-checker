import fs from 'fs';
import path from 'path';
import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

const DOSSIERS = process.argv.slice(2);
if (DOSSIERS.length === 0) {
  console.error('Usage: node scripts/batch_processor.js <DOSSIER_1> <DOSSIER_2> ...');
  process.exit(1);
}

const BASE_PHOTOS = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos';
const BASE_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const INSPECT_BASE = path.resolve('tests/inspect_batch');

if (!fs.existsSync(INSPECT_BASE)) {
  fs.mkdirSync(INSPECT_BASE, { recursive: true });
}

async function processDossier(dossier) {
  console.log(`\n========================================`);
  console.log(`Processing dossier: ${dossier}`);
  console.log(`========================================`);

  const photoDir = path.join(BASE_PHOTOS, dossier);
  const jobFile = path.join(BASE_OCR, `${dossier}.job.json`);
  const bakFile = path.join(BASE_OCR, `${dossier}.job.json.bak`);

  if (!fs.existsSync(photoDir)) {
    console.error(`Photo dir not found: ${photoDir}`);
    return;
  }
  if (!fs.existsSync(jobFile)) {
    console.error(`Job file not found: ${jobFile}`);
    return;
  }

  // Backup job file
  if (!fs.existsSync(bakFile)) {
    fs.copyFileSync(jobFile, bakFile);
    console.log(`Created backup: ${bakFile}`);
  }

  const outDir = path.join(INSPECT_BASE, dossier);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const photos = fs.readdirSync(photoDir)
    .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'))
    .sort();

  console.log(`Found ${photos.length} photos: ${photos[0]} -> ${photos[photos.length - 1]}`);

  // 1. Generate full view of cover and last 2 photos
  const specialPhotos = [photos[0], photos[photos.length - 2], photos[photos.length - 1]];
  for (const sp of specialPhotos) {
    if (sp) {
      const src = path.join(photoDir, sp);
      const dst = path.join(outDir, `full_${sp}`);
      await sharp(src)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(dst);
    }
  }

  // 2. Generate Top-Right crops for handwritten sheet numbers & notes
  console.log(`Generating Top-Right crops...`);
  const trBuffers = [];
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const src = path.join(photoDir, p);
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;

    // Crop top-right: right 45%, top 18%
    const cropW = Math.round(w * 0.45);
    const cropH = Math.round(h * 0.18);
    const left = w - cropW;
    const top = 0;

    const cropBuf = await sharp(src)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(320, 160, { fit: 'fill' })
      .composite([{
        input: Buffer.from(`
          <svg width="320" height="160">
            <rect x="0" y="0" width="70" height="26" fill="rgba(0,0,0,0.8)" />
            <text x="5" y="19" font-family="Arial" font-size="16" font-weight="bold" fill="#00FFCC">${p.replace('.jpg','')}</text>
          </svg>
        `),
        top: 0,
        left: 0
      }])
      .jpeg({ quality: 80 })
      .toBuffer();

    trBuffers.push({ name: p, buf: cropBuf });
  }

  // Stitch Top-Right into 4x4 collages (16 per collage)
  const trCollageSize = 16;
  const trCols = 4;
  const trCellW = 320;
  const trCellH = 160;

  for (let c = 0; c < Math.ceil(trBuffers.length / trCollageSize); c++) {
    const chunk = trBuffers.slice(c * trCollageSize, (c + 1) * trCollageSize);
    const rows = Math.ceil(chunk.length / trCols);
    const collageW = trCols * trCellW;
    const collageH = rows * trCellH;

    const composites = chunk.map((item, idx) => ({
      input: item.buf,
      left: (idx % trCols) * trCellW,
      top: Math.floor(idx / trCols) * trCellH
    }));

    const collagePath = path.join(outDir, `tr_collage_${c + 1}.jpg`);
    await sharp({
      create: {
        width: collageW,
        height: collageH,
        channels: 3,
        background: { r: 30, g: 30, b: 30 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(collagePath);
  }

  // 3. Generate Header crops for letterhead, title, and staple marks
  console.log(`Generating Header crops...`);
  const hdBuffers = [];
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const src = path.join(photoDir, p);
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;

    // Crop top 25%, full width
    const cropW = w;
    const cropH = Math.round(h * 0.25);

    const cropBuf = await sharp(src)
      .extract({ left: 0, top: 0, width: cropW, height: cropH })
      .resize(600, 180, { fit: 'fill' })
      .composite([{
        input: Buffer.from(`
          <svg width="600" height="180">
            <rect x="0" y="0" width="80" height="26" fill="rgba(0,0,0,0.8)" />
            <text x="5" y="19" font-family="Arial" font-size="16" font-weight="bold" fill="#FFFF00">${p.replace('.jpg','')}</text>
          </svg>
        `),
        top: 0,
        left: 0
      }])
      .jpeg({ quality: 80 })
      .toBuffer();

    hdBuffers.push({ name: p, buf: cropBuf });
  }

  // Stitch Headers into 2x5 collages (10 per collage)
  const hdCollageSize = 10;
  const hdCols = 2;
  const hdCellW = 600;
  const hdCellH = 180;

  for (let c = 0; c < Math.ceil(hdBuffers.length / hdCollageSize); c++) {
    const chunk = hdBuffers.slice(c * hdCollageSize, (c + 1) * hdCollageSize);
    const rows = Math.ceil(chunk.length / hdCols);
    const collageW = hdCols * hdCellW;
    const collageH = rows * hdCellH;

    const composites = chunk.map((item, idx) => ({
      input: item.buf,
      left: (idx % hdCols) * hdCellW,
      top: Math.floor(idx / hdCols) * hdCellH
    }));

    const collagePath = path.join(outDir, `hd_collage_${c + 1}.jpg`);
    await sharp({
      create: {
        width: collageW,
        height: collageH,
        channels: 3,
        background: { r: 30, g: 30, b: 30 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(collagePath);
  }

  console.log(`Dossier ${dossier} preprocessing completed! Output saved in: ${outDir}`);
}

async function main() {
  console.log(`Starting Batch Processing for ${DOSSIERS.length} dossiers: ${DOSSIERS.join(', ')}`);
  for (const d of DOSSIERS) {
    await processDossier(d);
  }
  console.log(`\nALL DOSSIERS PREPROCESSED SUCCESSFULLY!`);
}

main().catch(err => {
  console.error('Fatal batch error:', err);
  process.exit(1);
});
