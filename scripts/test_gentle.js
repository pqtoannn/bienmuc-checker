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

async function testSingle() {
  await reloadGeminiPool();
  const pool = getGeminiPool();
  const res = await callGeminiWithRetry({
    pool,
    prompt: 'Đọc số viết tay trong ảnh này:',
    base64Data: fs.readFileSync('tests/inspect_19L/006_corner.jpg').toString('base64'),
    mimeType: 'image/jpeg',
    speed: 'fast'
  });
  console.log('Result for 006_corner:', res.text);
}
testSingle().catch(e => console.error('Error:', e.message));
