import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load .env if present
dotenv.config({ path: path.join(rootDir, '.env') });

// Read default.json
const defaultJsonPath = path.join(__dirname, 'default.json');
let defaults = {};
if (fs.existsSync(defaultJsonPath)) {
  try {
    defaults = JSON.parse(fs.readFileSync(defaultJsonPath, 'utf8'));
  } catch (e) {
    console.warn('Could not parse config/default.json:', e.message);
  }
}

const config = {
  rootDir,
  paths: {
    photosDir: process.env.DIR_PHOTOS || defaults.paths?.photosDir || path.join(rootDir, 'data', 'photos'),
    rawExcelDir: process.env.DIR_RAW_EXCEL || defaults.paths?.rawExcelDir || path.join(rootDir, 'data', 'raw_excel'),
    outputOcrDir: process.env.DIR_OUTPUT_OCR || defaults.paths?.outputOcrDir || path.join(rootDir, 'data', 'output_ocr'),
    outputExcelDir: process.env.DIR_OUTPUT_EXCEL || defaults.paths?.outputExcelDir || path.join(rootDir, 'data', 'output_excel'),
    taiLieuLoaiFile: process.env.FILE_TAI_LIEU_LOAI || defaults.paths?.taiLieuLoaiFile || path.join(rootDir, 'data', 'output_excel', 'Tl_loại_VP_Toàn_PL.xlsx')
  },
  archive: {
    donViCapTren: process.env.ARCHIVE_DON_VI_CAP_TREN || defaults.archive?.donViCapTren || 'Ủy ban nhân dân huyện Tân Phú',
    donVi: process.env.ARCHIVE_DON_VI || defaults.archive?.donVi || 'Ủy ban nhân dân xã Phú Lộc',
    phong: process.env.ARCHIVE_PHONG || defaults.archive?.phong || 'UBND xã Phú Lộc',
    banTo: process.env.ARCHIVE_BAN_TO || defaults.archive?.banTo || 'Văn phòng'
  },
  grid: defaults.grid || {
    thumbWidth: 160,
    thumbHeight: 120,
    cols: 6
  }
};

export default config;
