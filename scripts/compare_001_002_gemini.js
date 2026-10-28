import fs from 'fs';
import { reloadGeminiPool, getGeminiPool } from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/lib/gemini-runtime.js';
import { callGeminiWithRetry } from 'file:///D:/git_clone_ocr_bienmuc/bienmuc/lib/gemini-client.js';

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

async function compare() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  const buf1 = fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/001.jpg');
  const buf2 = fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/002.jpg');

  const prompt = `So sánh chi tiết 2 ảnh này:
Ảnh 1: 001.jpg
Ảnh 2: 002.jpg
Hãy cho biết:
1. Hai ảnh này là cùng một văn bản chụp lại (chụp đúp/chụp lỗi/bản nháp gạch bỏ), hay là 2 văn bản khác nhau, hay 2 trang của cùng một văn bản?
2. Chữ viết tay đè lên trên ảnh 1 là gì? Tại sao có chữ đó?
3. Trong hồ sơ lưu trữ chính thức, ảnh 1 có phải là Bản trùng / Bản nháp gạch bỏ không?`;

  const res = await callGeminiWithRetry({
    pool,
    prompt,
    base64Data: [buf1.toString('base64'), buf2.toString('base64')],
    mimeType: ['image/jpeg', 'image/jpeg'],
    speed: 'fast'
  });

  console.log(res.text);
}

compare().catch(console.error);
