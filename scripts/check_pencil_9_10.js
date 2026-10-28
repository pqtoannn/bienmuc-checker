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

async function checkPencil9and10() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  const res9 = await callGeminiWithRetry({
    pool,
    prompt: 'Quan sát kỹ góc trên bên phải hoặc toàn bộ ảnh 009, tìm xem có số viết tay hoặc số tờ nào ghi dạng "16-..." hoặc số nào không:',
    base64Data: fs.readFileSync('tests/inspect_19L/009_preview.jpg').toString('base64'),
    mimeType: 'image/jpeg',
    speed: 'fast'
  });
  console.log('009 pencil search:\n', res9.text);

  const res10 = await callGeminiWithRetry({
    pool,
    prompt: 'Quan sát kỹ góc trên bên phải hoặc toàn bộ ảnh 010, tìm xem có số viết tay hoặc số tờ nào ghi dạng "..." hoặc số nào không:',
    base64Data: fs.readFileSync('tests/inspect_19L/010_preview.jpg').toString('base64'),
    mimeType: 'image/jpeg',
    speed: 'fast'
  });
  console.log('010 pencil search:\n', res10.text);
}

checkPencil9and10().catch(e => console.error(e));
