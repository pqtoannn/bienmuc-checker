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

async function testOcr() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  const p = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19G/029.jpg';
  const buf = fs.readFileSync(p);
  const base64Data = buf.toString('base64');
  const mimeType = 'image/jpeg';

  const prompt = getPromptForScanType('document', 'fast');
  console.log('Calling Gemini with 60s timeout...');
  const t0 = Date.now();
  const res = await callGeminiWithRetry({
    pool,
    prompt,
    base64Data,
    mimeType,
    jsonMode: true,
    speed: 'fast'
  });
  console.log(`Success in ${(Date.now() - t0)/1000}s!`);
  console.log('Result text:\n', res.text);
}

testOcr().catch(e => console.error('Error:', e.message));
