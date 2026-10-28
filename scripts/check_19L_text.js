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

async function checkDetails() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  for (const fn of ['005', '006', '009', '010']) {
    const p = `tests/inspect_19L/${fn}_preview.jpg`;
    const res = await callGeminiWithRetry({
      pool,
      prompt: 'Hãy đọc toàn bộ văn bản trong ảnh này, đặc biệt chú ý số trang ghi ở đầu hoặc cuối hoặc góc văn bản (bút bi, bút chì, số trang in), số hiệu quyết định, ngày tháng, và danh sách kèm theo nếu có:',
      base64Data: fs.readFileSync(p).toString('base64'),
      mimeType: 'image/jpeg',
      speed: 'fast'
    });
    console.log(`\n=== FULL TEXT PHOTO ${fn} ===\n`, res.text);
  }
}

checkDetails().catch(e => console.error(e));
