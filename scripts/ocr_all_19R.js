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

const OUT_FILE = 'tests/inspect_batch2019_8/19R_ocr_summary.json';

async function ocrAll19R() {
  await reloadGeminiPool();
  const pool = getGeminiPool();

  let results = {};
  if (fs.existsSync(OUT_FILE)) {
    try {
      results = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
    } catch (e) {}
  }

  for (let i = 1; i <= 34; i++) {
    const fnStr = String(i).padStart(3, '0');
    const fn = `${fnStr}.jpg`;
    if (results[fn] && results[fn].pencil !== undefined) {
      console.log(`[Photo ${fn}] Already processed: pencil='${results[fn].pencil}', title='${results[fn].title?.slice(0, 30)}'`);
      continue;
    }

    const p = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2019_19R/${fn}`;
    if (!fs.existsSync(p)) continue;

    const buf = fs.readFileSync(p);
    const base64Data = buf.toString('base64');

    const prompt = `Bạn là chuyên gia lưu trữ tài liệu Việt Nam. Hãy quan sát ảnh scan tài liệu này và trả về JSON:
{
  "isCover": boolean (true nếu là bìa cặp hồ sơ màu xanh, bìa kẹp ngoài, giấy lót không có nội dung văn bản),
  "pencil": string (chữ số bút chì ghi ở góc trên bên phải trang tài liệu, đọc thật kỹ chữ số viết tay, ví dụ "01", "02", "03", "15"... Nếu không có ghi rỗng ""),
  "soKyHieu": string (số ký hiệu văn bản, nếu không có ghi ""),
  "ngayThang": string (ngày tháng năm theo dạng DD/MM/YYYY, nếu không có ghi ""),
  "tacGia": string (cơ quan ban hành hoặc tác giả, ví dụ "Ủy ban nhân dân xã Phú Lộc"),
  "trichYeu": string (trích yếu tên loại nội dung văn bản),
  "loaiBan": string ("Bản chính", "Bản sao", "Bản gốc"...),
  "hasSignatureOrStamp": boolean (true nếu trang này có chữ ký lãnh đạo hoặc dấu mộc đỏ, tức trang ký chốt),
  "isContinuation": boolean (true nếu đây là trang 2, trang 3 tiếp theo của văn bản trước đó)
}`;

    try {
      const res = await callGeminiWithRetry({
        pool,
        prompt,
        base64Data,
        mimeType: 'image/jpeg',
        jsonMode: true,
        speed: 'fast'
      });

      let json = {};
      try {
        const text = res.text.replace(/```json\n?|\n?```/g, '').trim();
        json = JSON.parse(text);
      } catch (err) {
        json = { raw: res.text };
      }

      results[fn] = json;
      fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');
      console.log(`[Photo ${fn}] pencil='${json.pencil}' | so='${json.soKyHieu}' | ngay='${json.ngayThang}' | title='${json.trichYeu?.slice(0, 40)}' | sign=${json.hasSignatureOrStamp}`);
    } catch (e) {
      console.error(`Error on ${fn}:`, e.message);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('Finished OCR on all 34 photos of 19R!');
}

ocrAll19R().catch(console.error);
