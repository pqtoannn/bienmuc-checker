import sharp from "sharp";
import fs from "fs";
import path from "path";
import config from "../config/index.js";

/**
 * Tạo lưới ảnh thu nhỏ góc trên bên phải (nơi ghi số tờ bằng bút chì) của toàn bộ ảnh scan trong hồ sơ
 * @param {Object} options
 * @param {string} options.dossierDir Đường dẫn thư mục chứa ảnh scan của hồ sơ
 * @param {string} [options.outDir] Thư mục lưu ảnh lưới (mặc định: ./inspect_output/<dosId>)
 * @param {string} [options.dossierId] Tên/mã hồ sơ (mặc định lấy từ tên thư mục)
 * @param {boolean} [options.excludeCover=true] Có bỏ qua ảnh 001.jpg (bìa) hay không
 * @param {number} [options.chunk=36] Số ảnh tối đa trong 1 lưới
 * @param {number} [options.cols=6] Số cột trong lưới
 * @param {number} [options.thumbWidth=160] Chiều rộng mỗi ô
 * @param {number} [options.thumbHeight=120] Chiều cao mỗi ô
 * @returns {Promise<string[]>} Danh sách đường dẫn các file lưới đã tạo
 */
export async function generateCornerGrids(options) {
  const {
    dossierDir,
    outDir,
    dossierId = path.basename(dossierDir),
    excludeCover = true,
    chunk = config.grid.chunk || 36,
    cols = config.grid.cols || 6,
    thumbWidth = config.grid.thumbWidth || 160,
    thumbHeight = config.grid.thumbHeight || 120,
  } = options;

  if (!fs.existsSync(dossierDir)) {
    throw new Error(`Không tìm thấy thư mục hồ sơ: ${dossierDir}`);
  }

  const targetOutDir = outDir || path.join(config.rootDir, "inspect_output", dossierId);
  if (!fs.existsSync(targetOutDir)) {
    fs.mkdirSync(targetOutDir, { recursive: true });
  }

  const allFiles = fs
    .readdirSync(dossierDir)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

  const files = excludeCover ? allFiles.filter((f) => !/^0*1\./i.test(f)) : allFiles;

  const totalParts = Math.ceil(files.length / chunk);
  const generatedFiles = [];

  for (let part = 0; part < totalParts; part++) {
    const slice = files.slice(part * chunk, (part + 1) * chunk);
    if (slice.length === 0) break;

    const thumbs = [];
    for (const f of slice) {
      const filePath = path.join(dossierDir, f);
      try {
        const meta = await sharp(filePath).metadata();
        const cropW = Math.round(meta.width * 0.28);
        const cropH = Math.round(meta.height * 0.22);
        const cropLeft = meta.width - cropW;

        const buf = await sharp(filePath)
          .extract({ left: cropLeft, top: 0, width: cropW, height: cropH })
          .resize(thumbWidth, thumbHeight, { fit: "fill" })
          .composite([
            {
              input: Buffer.from(
                `<svg width="${thumbWidth}" height="${thumbHeight}"><rect x="0" y="0" width="${thumbWidth}" height="22" fill="black"/><text x="5" y="16" fill="#ffff00" font-size="14" font-weight="bold" font-family="sans-serif">${f}</text></svg>`
              ),
              top: 0,
              left: 0,
            },
          ])
          .toBuffer();
        thumbs.push(buf);
      } catch (err) {
        console.warn(`Lỗi khi trích xuất góc ảnh ${f}:`, err.message);
      }
    }

    const rows = Math.ceil(thumbs.length / cols);
    const canvasW = cols * thumbWidth;
    const canvasH = rows * thumbHeight;

    const composites = thumbs.map((buf, idx) => ({
      input: buf,
      left: (idx % cols) * thumbWidth,
      top: Math.floor(idx / cols) * thumbHeight,
    }));

    const outFileName = `corners_${dossierId}_part${part + 1}.jpg`;
    const outFilePath = path.join(targetOutDir, outFileName);

    await sharp({
      create: {
        width: canvasW,
        height: canvasH,
        channels: 3,
        background: { r: 35, g: 35, b: 35 },
      },
    })
      .composite(composites)
      .jpeg({ quality: 85 })
      .toFile(outFilePath);

    generatedFiles.push(outFilePath);
  }

  return generatedFiles;
}

/**
 * Trích xuất độ phân giải cao góc trên bên phải của 1 tấm ảnh scan
 */
export async function cropTopRight(imagePath, outPath, options = {}) {
  const { widthRatio = 0.32, heightRatio = 0.22, resizeW = 600 } = options;

  const parentDir = path.dirname(outPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  const meta = await sharp(imagePath).metadata();
  const cropW = Math.round(meta.width * widthRatio);
  const cropH = Math.round(meta.height * heightRatio);
  const cropLeft = meta.width - cropW;

  return sharp(imagePath)
    .extract({ left: cropLeft, top: 0, width: cropW, height: cropH })
    .resize(resizeW)
    .jpeg({ quality: 90 })
    .toFile(outPath);
}

/**
 * Trích xuất tiêu đề hành chính (Quốc hiệu, Tiêu ngữ, Số hiệu, Ngày tháng)
 */
export async function cropHeader(imagePath, outPath, options = {}) {
  const { widthRatio = 0.7, heightRatio = 0.28, resizeW = 800 } = options;

  const parentDir = path.dirname(outPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  const meta = await sharp(imagePath).metadata();
  const cropW = Math.round(meta.width * widthRatio);
  const cropH = Math.round(meta.height * heightRatio);

  return sharp(imagePath)
    .extract({ left: 0, top: 0, width: cropW, height: cropH })
    .resize(resizeW)
    .jpeg({ quality: 90 })
    .toFile(outPath);
}

/**
 * Tạo bảng đối chiếu nhiều ảnh cạnh nhau (ví dụ: so sánh 2 bản scan trùng lặp)
 */
export async function createComparisonBoard(imagePaths, outPath, options = {}) {
  const { cols = 2, thumbW = 400, thumbH = 550, titles = [] } = options;

  const thumbs = [];
  for (let i = 0; i < imagePaths.length; i++) {
    const imgP = imagePaths[i];
    const title = titles[i] || path.basename(imgP);
    const buf = await sharp(imgP)
      .resize(thumbW, thumbH, { fit: "contain", background: { r: 20, g: 20, b: 20 } })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${thumbW}" height="30"><rect x="0" y="0" width="${thumbW}" height="30" fill="black"/><text x="10" y="21" fill="#00ffcc" font-size="16" font-weight="bold" font-family="sans-serif">${title}</text></svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .toBuffer();
    thumbs.push(buf);
  }

  const rows = Math.ceil(thumbs.length / cols);
  const canvasW = cols * thumbW;
  const canvasH = rows * thumbH;

  const composites = thumbs.map((buf, idx) => ({
    input: buf,
    left: (idx % cols) * thumbW,
    top: Math.floor(idx / cols) * thumbH,
  }));

  const parentDir = path.dirname(outPath);
  if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });

  return sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: { r: 20, g: 20, b: 20 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile(outPath);
}
