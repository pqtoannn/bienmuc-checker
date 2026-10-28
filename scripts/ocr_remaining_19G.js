import fs from 'fs';
import path from 'path';

process.env.GEMINI_CALL_TIMEOUT_MS = '60000';

const envText = fs.readFileSync('D:/git_clone_ocr_bienmuc/bienmuc/.env', 'utf8');
for (const line of envText.split('\n')) {
  const trim = line.trim();
  if (trim && !trim.startsWith('#')) {
    const idx = trim.indexOf('=');
    if (idx > 0) {
      const k = trim.slice(0, idx).trim();
      const v = trim.slice(idx + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

import { reloadGeminiPool, getGeminiPool } from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/lib/gemini-runtime.js';
import { callGeminiWithRetry } from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/lib/gemini-client.js';
import { getPromptForScanType, parseBienMucJson } from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/lib/bienmuc-prompt.js';

const OUT_JSON = 'tests/inspect_19G/ocr_results_19G.json';

async function ocrPhoto(pool, photoNum) {
  const fnStr = String(photoNum).padStart(3, '0');
  const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19G/${fnStr}.jpg`;
  if (!fs.existsSync(p)) return null;

  const buf = fs.readFileSync(p);
  const base64Data = buf.toString('base64');
  const mimeType = 'image/jpeg';
  const prompt = getPromptForScanType('document', 'fast');

  const t0 = Date.now();
  const res = await callGeminiWithRetry({
    pool,
    prompt,
    base64Data,
    mimeType,
    jsonMode: true,
    speed: 'fast'
  });

  const parsed = parseBienMucJson(res.text);
  const row = (parsed && parsed.rows && parsed.rows.length > 0) ? parsed.rows[0] : {
    soTT: '',
    soKyHieuVanBan: '',
    ngayThangVanBan: '',
    tenLoaiTrichYeu: '',
    tacGiaVanBan: '',
    toSoTrangSo: '',
    loaiBan: 'Bản gốc',
    ghiChu: ''
  };

  row.sourceFileNames = [`${fnStr}.jpg`];
  console.log(`[Photo ${fnStr}] Done in ${((Date.now() - t0)/1000).toFixed(1)}s: so='${row.soKyHieuVanBan}' toSo='${row.toSoTrangSo}' ngay='${row.ngayThangVanBan}'`);
  return { fileName: `${fnStr}.jpg`, row };
}

async function runWorker(pool, queue, results) {
  while (queue.length > 0) {
    const num = queue.shift();
    try {
      const res = await ocrPhoto(pool, num);
      if (res) {
        results[res.fileName] = res.row;
        fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2), 'utf8');
      }
    } catch (e) {
      console.error(`Error on ${num}:`, e.message);
    }
  }
}

async function main() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  let results = {};
  if (fs.existsSync(OUT_JSON)) {
    try {
      results = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'));
    } catch(e) {}
  }

  const queue = [];
  for (let i = 29; i <= 118; i++) {
    const fnStr = String(i).padStart(3, '0') + '.jpg';
    if (!results[fnStr]) {
      queue.push(i);
    }
  }

  console.log(`Starting OCR for ${queue.length} remaining photos in 19G with concurrency 3...`);
  const concurrency = 3;
  const workers = [];
  for (let w = 0; w < concurrency; w++) {
    workers.push(runWorker(pool, queue, results));
  }

  await Promise.all(workers);
  console.log(`ALL DONE! Total results: ${Object.keys(results).length}`);
}

main().catch(e => console.error('Fatal error:', e));
