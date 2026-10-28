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

async function examine19R_Photos(start, end) {
  await reloadGeminiPool();
  const pool = getGeminiPool();
  for (let i = start; i <= end; i++) {
    const fnStr = String(i).padStart(3, '0');
    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/${fnStr}.jpg`;
    if (!fs.existsSync(p)) continue;
    const buf = fs.readFileSync(p);
    const base64Data = buf.toString('base64');

    const prompt = `Bạn là chuyên gia lưu trữ văn bản Việt Nam. Hãy quan sát ảnh scan tài liệu này và cho biết:
1. Đây có phải bìa hồ sơ màu xanh/bìa kẹp ngoài không? (hay là văn bản/tài liệu hành chính?)
2. Số hiệu văn bản (nếu có):
3. Ngày tháng năm văn bản (nếu có):
4. Cơ quan ban hành/tác giả:
5. Trích yếu/tiêu đề tài liệu:
6. Loại bản (Bản chính, Bản sao, Bản gốc...):
7. Số trang/tờ ghi bằng bút chì ở góc trên bên phải hoặc trong tài liệu:
8. Trang này có dấu mộc/chữ ký không? (kết thúc văn bản hay còn trang tiếp?)`;

    const res = await callGeminiWithRetry({
      pool,
      prompt,
      base64Data,
      mimeType: 'image/jpeg',
      speed: 'fast'
    });

    console.log(`\n=================== 19R - ${fnStr}.jpg ===================`);
    console.log(res.text);
    await new Promise(r => setTimeout(r, 1500));
  }
}

// Let's examine first 5 photos of 19R
examine19R_Photos(1, 5).catch(console.error);
