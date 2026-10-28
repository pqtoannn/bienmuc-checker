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

async function inspect001() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  const buf1 = fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/001.jpg');
  const res1 = await callGeminiWithRetry({
    pool,
    prompt: `Đọc toàn bộ nội dung của trang tài liệu này, đặc biệt là phần đầu trang, chữ viết tay đè lên, tiêu đề, danh sách, chữ ký và con dấu:`,
    base64Data: buf1.toString('base64'),
    mimeType: 'image/jpeg',
    speed: 'fast'
  });
  console.log('=== 001.jpg ===');
  console.log(res1.text);

  const buf2 = fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/002.jpg');
  const res2 = await callGeminiWithRetry({
    pool,
    prompt: `Đọc toàn bộ nội dung của trang tài liệu này, đặc biệt là phần đầu trang, tiêu đề, danh sách, chữ ký và con dấu:`,
    base64Data: buf2.toString('base64'),
    mimeType: 'image/jpeg',
    speed: 'fast'
  });
  console.log('=== 002.jpg ===');
  console.log(res2.text);
}

inspect001().catch(console.error);
