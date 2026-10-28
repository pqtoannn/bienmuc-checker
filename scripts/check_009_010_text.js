import fs from 'fs';
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

async function check009and010() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  const res9 = await callGeminiWithRetry({
    pool,
    prompt: 'Đọc đoạn Điều 1 và Điều 2 của Quyết định 10/QĐ-UBND trong ảnh này xem khen thưởng bao nhiêu tập thể và bao nhiêu cá nhân:',
    base64Data: fs.readFileSync('tests/inspect_19L/009_preview.jpg').toString('base64'),
    mimeType: 'image/jpeg',
    speed: 'fast'
  });
  console.log('009 Điều 1-2:\n', res9.text);

  const res10 = await callGeminiWithRetry({
    pool,
    prompt: 'Đọc đoạn Điều 1 và Điều 2 của Quyết định 12/QĐ-UBND trong ảnh này xem khen thưởng bao nhiêu tập thể và bao nhiêu cá nhân:',
    base64Data: fs.readFileSync('tests/inspect_19L/010_preview.jpg').toString('base64'),
    mimeType: 'image/jpeg',
    speed: 'fast'
  });
  console.log('010 Điều 1-2:\n', res10.text);
}

check009and010().catch(e => console.error(e));
