import fs from 'fs';

const p = 'tests/inspect_batch2019_8/19R_ocr_summary.json';
if (fs.existsSync(p)) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const keys = Object.keys(data).sort();
  console.log(`Summary has ${keys.length} items:`);
  for (const k of keys) {
    const item = data[k];
    console.log(`[${k}] pencil='${item.pencil}' | so='${item.soKyHieu}' | date='${item.ngayThang}' | title='${item.trichYeu?.slice(0, 35)}' | sign=${item.hasSignatureOrStamp}`);
  }
} else {
  console.log('Summary file not created yet');
}
