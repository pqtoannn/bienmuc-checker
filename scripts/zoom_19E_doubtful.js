import sharp from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'tests/inspect_19E/zoom';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const checkList = [
  '021', '022', '023', '024', '025',
  '026', '027', '028', '029', '030',
  '031', '032', '033', '034', '035', '036', '037', '038', '039', '040',
  '041', '042', '043', '044', '045', '046', '047', '048', '049', '050',
  '051', '052', '053', '054', '055', '056', '057', '058', '059', '060',
  '061', '062', '063', '064', '065', '066', '067', '068', '069', '070', '071', '072'
];

async function run() {
  for (const fnStr of ['021', '022', '023', '024', '025', '031', '032', '034', '035', '040', '041', '042', '044', '046', '048', '056', '057', '058', '060', '066']) {
    const fn = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19E/${fnStr}.jpg`;
    await sharp(fn)
      .extract({ left: 1000, top: 0, width: 850, height: 350 })
      .toFile(path.join(outDir, `${fnStr}_pencil_zoom.jpg`));
    
    // Also crop the doc header (left side) to check soHieu / ngayThang
    await sharp(fn)
      .extract({ left: 150, top: 20, width: 850, height: 350 })
      .toFile(path.join(outDir, `${fnStr}_header_zoom.jpg`));
  }
  console.log('Done zooming');
}

run();
