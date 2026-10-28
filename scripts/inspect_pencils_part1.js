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

async function inspectPencils() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  for (let i = 1; i <= 17; i++) {
    const fnStr = String(i).padStart(3, '0');
    const p = `tests/inspect_batch2019_8/19R_details/${fnStr}_pencil.jpg`;
    if (!fs.existsSync(p)) continue;
    const buf = fs.readFileSync(p);

    const prompt = `Đọc chính xác chữ số bút chì viết tay ở góc trên ảnh này. Chỉ trả lời số bút chì (ví dụ "01", "02", "15"... hoặc "Không có"):`;

    const res = await callGeminiWithRetry({
      pool,
      prompt,
      base64Data: buf.toString('base64'),
      mimeType: 'image/jpeg',
      speed: 'fast'
    });

    console.log(`[Photo ${fnStr}] Pencil: ${res.text.trim()}`);
    await new Promise(r => setTimeout(r, 1000));
  }
}

inspectPencils().catch(console.error);
