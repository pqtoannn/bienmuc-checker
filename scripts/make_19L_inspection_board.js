import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';

async function makeBoard() {
  const cards = [];
  for (let i = 1; i <= 13; i++) {
    const fn = String(i).padStart(3, '0');
    const pHead = `tests/inspect_19L/${fn}_head.jpg`;
    const pTop = `tests/inspect_19L/${fn}_topright.jpg`;
    if (!fs.existsSync(pHead)) continue;

    const headBuf = await sharp(pHead).resize(450, 160, { fit: 'fill' }).toBuffer();
    const topBuf = await sharp(pTop).resize(200, 160, { fit: 'inside' }).toBuffer();

    const labelSvg = Buffer.from(
      `<svg width="700" height="30">
        <rect width="700" height="30" fill="#222"/>
        <text x="10" y="20" font-family="sans-serif" font-size="16" font-weight="bold" fill="#00ffcc">${fn}.jpg</text>
      </svg>`
    );

    const card = await sharp({
      create: { width: 700, height: 200, channels: 3, background: { r: 240, g: 240, b: 240 } }
    })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: headBuf, left: 10, top: 35 },
      { input: topBuf, left: 480, top: 35 }
    ])
    .jpeg()
    .toBuffer();

    cards.push(card);
  }

  // stack cards vertically
  const totalH = cards.length * 205 + 10;
  const composites = cards.map((c, idx) => ({
    input: c,
    left: 10,
    top: idx * 205 + 10
  }));

  await sharp({
    create: { width: 720, height: totalH, channels: 3, background: { r: 180, g: 180, b: 180 } }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile('tests/inspect_19L/inspection_board.jpg');

  console.log('Saved tests/inspect_19L/inspection_board.jpg');
}

makeBoard().catch(e => console.error(e));
