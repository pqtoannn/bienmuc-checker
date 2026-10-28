import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19A';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function createCard(imgNum) {
  const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19A/${imgNum}.jpg`;
  
  // Left: Agency & Number & Subject
  const leftBuf = await sharp(fn)
    .extract({ left: 150, top: 30, width: 850, height: 350 })
    .resize(450, 180, { fit: 'fill' })
    .toBuffer();

  // Right: Pencil number & Date
  const rightBuf = await sharp(fn)
    .extract({ left: 1050, top: 0, width: 700, height: 280 })
    .resize(400, 180, { fit: 'fill' })
    .toBuffer();

  // Combine into a 900x210 card with label
  const card = await sharp({
    create: {
      width: 900,
      height: 210,
      channels: 3,
      background: { r: 230, g: 230, b: 235 }
    }
  })
  .composite([
    { input: leftBuf, left: 10, top: 25 },
    { input: rightBuf, left: 470, top: 25 },
  ])
  .jpeg()
  .toBuffer();

  return card;
}

async function main() {
  const cards = [];
  for (const num of ['002', '003', '004', '005']) {
    cards.push(await createCard(num));
  }

  // Stack 4 cards vertically
  const collage = await sharp({
    create: {
      width: 920,
      height: 4 * 220 + 20,
      channels: 3,
      background: { r: 200, g: 200, b: 200 }
    }
  })
  .composite(
    cards.map((c, idx) => ({
      input: c,
      left: 10,
      top: 10 + idx * 220
    }))
  )
  .jpeg({ quality: 85 })
  .toFile(path.join(outDir, 'sample_cards.jpg'));

  console.log('Saved sample_cards.jpg');
}

main().catch(console.error);
