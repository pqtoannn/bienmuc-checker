import assert from "assert";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import { exportJsonToExcel, FONT_NAME, FONT_SIZE, HEADERS_VP, COL_WIDTHS_VP } from "../lib/excel-export-vp.js";

async function runTest() {
  console.log("==================================================================");
  console.log("KIỂM THỬ XUẤT EXCEL BIÊN MỤC KHỐI VĂN PHÒNG (VP / UBND)");
  console.log("==================================================================");

  const testJsonPath = path.resolve("examples/mau_bien_muc_vp.json");
  const testOutputDir = path.resolve("tests/output");
  const testOutputFile = path.join(testOutputDir, "Test_MucLuc_VP.xlsx");

  if (fs.existsSync(testOutputDir)) {
    fs.rmSync(testOutputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(testOutputDir, { recursive: true });

  console.log("1. Gọi hàm exportJsonToExcel...");
  const result = await exportJsonToExcel(testJsonPath, testOutputFile);

  assert.strictEqual(result.success, true, "Kết quả export phải thành công");
  assert.strictEqual(fs.existsSync(testOutputFile), true, "File Excel phải được tạo trên ổ đĩa");
  assert.strictEqual(result.rowCount, 5, "Số lượng văn bản xuất ra phải là 5");
  assert.strictEqual(result.trungCount, 1, "Số lượng tài liệu loại phải là 1");
  console.log(`✓ Tạo file thành công: ${result.fileName} (${(result.fileSize / 1024).toFixed(1)} KB)`);

  console.log("2. Đọc lại file Excel để thẩm định cấu trúc theo chuẩn bienmuc...");
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(testOutputFile);

  const ws = wb.getWorksheet("Mục lục văn bản");
  assert.ok(ws, "Sheet 'Mục lục văn bản' phải tồn tại");
  assert.strictEqual(ws.pageSetup.orientation, "landscape", "Trang in phải là khổ ngang (landscape)");
  assert.strictEqual(ws.pageSetup.fitToWidth, 1, "fitToWidth phải là 1");

  console.log("3. Kiểm tra độ rộng các cột (COL_WIDTHS_VP)...");
  COL_WIDTHS_VP.forEach((w, i) => {
    assert.strictEqual(ws.columns[i].width, w, `Cột ${i + 1} phải có độ rộng ${w}`);
  });
  console.log("✓ Khớp 8 cột và độ rộng chuẩn 100%");

  console.log("4. Kiểm tra Header & Title...");
  const cellA1 = ws.getCell(1, 1);
  assert.strictEqual(cellA1.value, "MỤC LỤC VĂN BẢN, TÀI LIỆU");
  assert.strictEqual(cellA1.font.name, FONT_NAME);
  assert.strictEqual(cellA1.font.bold, true);

  console.log("5. Kiểm tra tự động tính toán dải số tờ (calculateAutoPageRanges)...");
  // Row 1: gốc "01", row kế tiếp bắt đầu "04" -> phải tính thành "01-03"
  // Dòng dữ liệu bắt đầu sau các dòng header
  // Tìm dòng có STT = 1
  let dataStartRow = -1;
  for (let r = 1; r <= 15; r++) {
    if (ws.getCell(r, 1).value === "1") {
      dataStartRow = r;
      break;
    }
  }
  assert.ok(dataStartRow > 0, "Phải tìm thấy dòng dữ liệu STT 1");

  const toSoRow1 = ws.getCell(dataStartRow, 6).value;
  const toSoRow2 = ws.getCell(dataStartRow + 1, 6).value;
  const toSoRow3 = ws.getCell(dataStartRow + 2, 6).value;
  const toSoRow4 = ws.getCell(dataStartRow + 3, 6).value;
  const toSoRow5 = ws.getCell(dataStartRow + 4, 6).value;

  console.log(`   Dòng 1: ${toSoRow1} (kỳ vọng: 01-03)`);
  console.log(`   Dòng 2: ${toSoRow2} (kỳ vọng: 04-07)`);
  console.log(`   Dòng 3: ${toSoRow3} (kỳ vọng: 08-11)`);
  console.log(`   Dòng 4: ${toSoRow4} (kỳ vọng: 12-13)`);
  console.log(`   Dòng 5: ${toSoRow5} (kỳ vọng: 14-15)`);

  assert.strictEqual(toSoRow1, "01-03", "Dòng 1 phải tự nhảy thành 01-03");
  assert.strictEqual(toSoRow2, "04-07", "Dòng 2 phải tự nhảy thành 04-07");
  assert.strictEqual(toSoRow3, "08-11", "Dòng 3 giữ nguyên 08-11");
  assert.strictEqual(toSoRow4, "12-13", "Dòng 4 phải tự nhảy thành 12-13");
  assert.strictEqual(toSoRow5, "14-15", "Dòng 5 giữ nguyên 14-15");

  console.log("6. Kiểm tra sheet phụ 'Tài liệu loại'...");
  const wsTrung = wb.getWorksheet("Tài liệu loại");
  assert.ok(wsTrung, "Sheet 'Tài liệu loại' phải tồn tại");
  const trungTitle = wsTrung.getCell(1, 2).value;
  assert.strictEqual(trungTitle, "DANH MỤC TÀI LIỆU LOẠI");

  console.log("==================================================================");
  console.log("🎉 TẤT CẢ KIỂM THỬ XUẤT EXCEL BIÊN MỤC VP ĐẠT 100%!");
  console.log("==================================================================");
}

runTest().catch((err) => {
  console.error("❌ THẤT BẠI:", err);
  process.exit(1);
});
