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

async function checkEnd() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  for (let i = 205; i <= 211; i++) {
    const fn = String(i).padStart(3, '0');
    const p = `tests/inspect_19N/${fn}_p.jpg`;
    const res = await callGeminiWithRetry({
      pool,
      prompt: 'Đọc số viết tay bằng bút chì trong ảnh này (chỉ trả về số hoặc chữ số viết tay, ví dụ "204" hay "205" hay "205a" hay "207-208"):',
      base64Data: fs.readFileSync(p).toString('base64'),
      mimeType: 'image/jpeg',
      speed: 'fast'
    });
    console.log(`${fn}: ${res.text.trim()}`);
    await new Promise(r => setTimeout(r, 1500));
  }
}

checkEnd().catch(e => console.error(e));
