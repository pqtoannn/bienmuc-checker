import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';

async function makeInfoMontage() {
  const list1 = [104, 105, 106, 107, 108, 109, 110];
  const list2 = [111, 112, 113, 114, 115, 116, 117];

  for (const [idx, list] of [[1, list1], [2, list2]]) {
    const buffers = [];
    for (const num of list) {
      const fn = `tests/inspect_19G/info_${num}.jpg`;
      const buf = await sharp(fn).resize(700, 200, {fit: 'contain', background: '#fff'}).toBuffer();
      const svg = Buffer.from(`<svg width="700" height="25"><rect width="700" height="25" fill="#333"/><text x="350" y="18" font-size="16" fill="#0ff" text-anchor="middle" font-family="sans-serif" font-weight="bold">Photo ${num}.jpg</text></svg>`);
      const card = await sharp({
        create: { width: 700, height: 225, channels: 3, background: '#fff' }
      }).composite([
        { input: svg, left: 0, top: 0 },
        { input: buf, left: 0, top: 25 }
      ]).jpeg().toBuffer();
      buffers.push(card);
    }

    await sharp({
      create: { width: 700, height: 225 * 7, channels: 3, background: '#000' }
    }).composite(buffers.map((b, i) => ({ input: b, left: 0, top: i * 225 })))
      .jpeg({quality: 85}).toFile(`tests/inspect_19G/montage_info_${idx}.jpg`);
  }
  console.log('Montages saved.');
}

makeInfoMontage().catch(console.error);
