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

async function check19L() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  for (let i = 1; i <= 13; i++) {
    const fnStr = String(i).padStart(3, '0');
    const pPencil = `tests/inspect_19L/${fnStr}_pencil.jpg`;
    const pHdr = `tests/inspect_19L/${fnStr}_header.jpg`;
    if (!fs.existsSync(pPencil)) continue;

    const resPencil = await callGeminiWithRetry({
      pool,
      prompt: 'Đọc số viết tay bằng bút chì ở góc trên bên phải (chỉ trả về số hoặc khoảng số, ví dụ "01" hoặc "03-07", không giải thích thêm):',
      base64Data: fs.readFileSync(pPencil).toString('base64'),
      mimeType: 'image/jpeg',
      speed: 'fast'
    });

    const resHdr = await callGeminiWithRetry({
      pool,
      prompt: 'Đọc số hiệu văn bản (soKyHieu) và ngày tháng (ngayThang) và trích yếu ngắn gọn từ góc tiêu đề này (chỉ trả về dạng: So: ... | Ngay: ... | TrichYeu: ...):',
      base64Data: fs.readFileSync(pHdr).toString('base64'),
      mimeType: 'image/jpeg',
      speed: 'fast'
    });

    console.log(`[Photo ${fnStr}] Pencil: '${resPencil.text.trim()}' | ${resHdr.text.trim().replace(/\n/g, ' ')}`);
  }
}

check19L().catch(e => console.error(e));
