import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

const dir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2022_22R';
const outDir = 'd:/BG/Check_HS_BM/tests/collages_22R';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();

for (let batch = 0; batch < 3; batch++) {
  const batchFiles = files.slice(batch * 15, (batch + 1) * 15);
  const tileW = 400;
  const tileH = 250;
  const cols = 3;
  const rows = 5;
  const canvasW = tileW * cols;
  const canvasH = tileH * rows;

  const composites = [];
  for (let i = 0; i < batchFiles.length; i++) {
    const f = batchFiles[i];
    const c = i % cols;
    const r = Math.floor(i / cols);
    const meta = await sharp(dir + '/' + f).metadata();
    
    // Crop top 25% height, right 35% width
    const cropW = Math.round(meta.width * 0.35);
    const cropH = Math.round(meta.height * 0.22);
    const left = meta.width - cropW;
    const top = 0;

    const tileBuf = await sharp(dir + '/' + f)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(tileW, tileH, { fit: 'contain', background: '#ffffff' })
      .toBuffer();

    const labelSvg = Buffer.from(
      `<svg width="${tileW}" height="${tileH}">
        <rect x="0" y="0" width="85" height="28" fill="black" />
        <text x="5" y="20" font-family="Arial" font-size="18" font-weight="bold" fill="yellow">${f}</text>
      </svg>`
    );

    const tileWithLabel = await sharp(tileBuf)
      .composite([{ input: labelSvg, left: 0, top: 0 }])
      .toBuffer();

    composites.push({
      input: tileWithLabel,
      left: c * tileW,
      top: r * tileH,
    });
  }

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: '#ffffff',
    }
  })
  .composite(composites)
  .toFile(outDir + '/collage_batch_' + (batch + 1) + '.jpg');
  console.log('Created collage batch ' + (batch + 1));
}
