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

async function readCollages() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  for (const part of ['part1', 'part2']) {
    const p = `tests/inspect_batch2019_8/collage_19R_rows_${part}.jpg`;
    const buf = fs.readFileSync(p);

    const prompt = `Đây là bảng ghép thông tin của các bức ảnh tài liệu trong hồ sơ PL_2019_19R.
Mỗi dòng gồm: [Tên file .jpg] | [Phần đầu văn bản / Tiêu đề / Ngày tháng / Tác giả] | [Góc bút chì góc trên bên phải] | [Chữ ký / Con dấu].
Hãy đọc thật cẩn thận và trả về bảng JSON cho tất cả các dòng trong ảnh:
[
  {
    "file": "001.jpg",
    "soKyHieu": "...",
    "ngayThang": "DD/MM/YYYY",
    "tacGia": "...",
    "trichYeu": "...",
    "pencil": "chữ số bút chì nhìn thấy ở cột góc bút chì",
    "hasStampSign": true/false,
    "isDuplicateOrDraft": true/false (nếu là bản chụp trùng hoặc bản nháp gạch chéo/sửa đổi)
  },
  ...
]`;

    console.log(`\n=================== READING ${part} ===================`);
    const res = await callGeminiWithRetry({
      pool,
      prompt,
      base64Data: buf.toString('base64'),
      mimeType: 'image/jpeg',
      speed: 'fast'
    });

    console.log(res.text);
    fs.writeFileSync(`tests/inspect_batch2019_8/19R_${part}_analysis.txt`, res.text, 'utf8');
    await new Promise(r => setTimeout(r, 2000));
  }
}

readCollages().catch(console.error);
