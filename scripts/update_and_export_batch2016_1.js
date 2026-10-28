import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { exportJsonToExcel } from '../lib/excel-export-vp.js';
import { appendTaiLieuLoai } from '../lib/tai-lieu-loai-sync.js';

const P_OUTPUT_OCR = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR';
const P_DA_CHECK = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/Da_check';
const P_RAW_EXCEL = 'C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check';

async function processDossier(config) {
  const { dosId, title, year, skipFiles, rowsConfig } = config;
  console.log(`\n========================================\nProcessing ${dosId}...`);

  const jobPath = path.join(P_OUTPUT_OCR, `${dosId}.job.json`);
  let job;
  if (fs.existsSync(jobPath)) {
    job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
  } else {
    job = { data: {}, images: [] };
  }

  job.data = job.data || {};
  job.data.tenHoSo = title;
  job.data.tieuDeNghiQuyet = title;
  job.data.donViCapTren = 'Ủy ban nhân dân huyện Tân Phú';
  job.data.donVi = 'Ủy ban nhân dân xã Phú Lộc';
  job.data.namGiaiDoan = year;
  job.data.tongSoToText = '';

  if (job.images) {
    job.images.forEach(im => {
      if (skipFiles && skipFiles.includes(im.fileName)) {
        im.status = 'skip';
        im.isExcluded = true;
        im.skipReason = 'Bìa hồ sơ hoặc tờ chốt đính kèm / trùng lặp';
      }
    });
  }

  const activeRows = [];
  for (let i = 0; i < rowsConfig.length; i++) {
    const rc = rowsConfig[i];
    let so = rc.so || '';
    let d = rc.d || '';
    let tg = rc.tg || 'Ủy ban nhân dân xã Phú Lộc';
    let ty = rc.ty || '';
    let loaiBan = rc.loaiBan || 'Bản gốc';

    if (tg.toLowerCase().includes('uỷ')) {
      tg = tg.replace(/uỷ/g, 'ủy').replace(/Uỷ/g, 'Ủy');
    }

    activeRows.push({
      soTT: String(i + 1),
      soKyHieuVanBan: so,
      ngayThangVanBan: d,
      tenLoaiTrichYeu: ty,
      tacGiaVanBan: tg,
      toSoTrangSo: rc.toSo,
      loaiBan: loaiBan,
      ghiChu: '',
      banGocChinh: loaiBan.includes('gốc') || loaiBan.includes('chính') ? loaiBan : '',
      banSao: loaiBan.includes('sao') || loaiBan.includes('Photo') ? loaiBan : '',
      doMat: '',
      sourceFileNames: rc.files || [rc.p]
    });
  }

  job.data.rows = activeRows;
  job.data.rowsTrung = [];

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8');

  // Export to PL_outputOCR
  const outExcelOcr = path.join(P_OUTPUT_OCR, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelOcr);
  console.log(`Exported to ${outExcelOcr}`);

  // Export to Da_check
  const outExcelDaCheck = path.join(P_DA_CHECK, `${dosId}.xlsx`);
  await exportJsonToExcel(job, outExcelDaCheck);
  console.log(`Exported to ${outExcelDaCheck}`);

  console.log(`Done ${dosId}: ${activeRows.length} active rows.`);
}

async function run() {
  // 1. PL_2016_16C
  await processDossier({
    dosId: 'PL_2016_16C',
    title: 'BIÊN BẢN + HỢP ĐỒNG',
    year: '2016',
    skipFiles: ['001.jpg'],
    rowsConfig: [
      {
        p: '002.jpg',
        so: '0006/TTĐ4/TTĐMĐ1-2016',
        d: '04/01/2016',
        ty: 'Hợp đồng bảo vệ đường dây và hành lang an toàn đường dây 500KV',
        tg: 'Truyền tải điện Miền Đông 1',
        toSo: '01-03',
        loaiBan: 'Bản gốc'
      },
      {
        p: '003.jpg',
        so: '',
        d: '20/05/2016',
        ty: 'Biên bản về việc kiểm tra cấp điện tại địa điểm bỏ phiếu Bầu cử ĐBQH khoá XIV và ĐB HĐND các cấp nhiệm kỳ 2016 - 2021',
        tg: 'Điện lực Định Quán',
        toSo: '04-05',
        loaiBan: 'Bản gốc'
      },
      {
        p: '004.jpg',
        so: '',
        d: '20/10/2016',
        ty: 'Biên bản bàn giao phần mềm',
        tg: 'VNPT Đồng Nai',
        toSo: '06',
        loaiBan: 'Bản gốc'
      }
    ]
  });

  // 2. PL_2016_16M
  // Note: 008.jpg is duplicate of 007.jpg
  await appendTaiLieuLoai({
    type: 'trung',
    dossierId: 'PL_2016_16M',
    title: 'Biên bản làm việc của Đoàn thanh tra Sở Nội vụ tỉnh Đồng Nai',
    reason: 'Trùng hs PL_2016_16M',
    notes: 'Trùng trang 12 (008.jpg)'
  });

  await processDossier({
    dosId: 'PL_2016_16M',
    title: 'ĐẠO ĐỨC CÔNG VỤ',
    year: '2016',
    skipFiles: ['001.jpg', '008.jpg'],
    rowsConfig: [
      {
        p: '002.jpg',
        so: '',
        d: '02/03/2016',
        ty: 'Biên bản làm việc về việc thực hiện Quyết định số 19/UBND-NC',
        tg: 'Tổ kiểm tra - Ủy ban nhân dân xã Phú Lộc',
        toSo: '01-04',
        loaiBan: 'Bản gốc'
      },
      {
        p: '003.jpg',
        so: '50/QĐ-UBND',
        d: '10/03/2016',
        ty: 'Quyết định về việc củng cố tổ kiểm tra kỷ cương hành chính, đạo đức công vụ đối với cán bộ, công chức xã Phú Lộc',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        toSo: '05-08',
        loaiBan: 'Bản chính'
      },
      {
        p: '004.jpg',
        so: '',
        d: '15/09/2016',
        ty: 'Biên bản kiểm tra',
        tg: 'Phòng Nội vụ huyện Tân Phú',
        toSo: '09',
        loaiBan: 'Bản chính'
      },
      {
        p: '005.jpg',
        so: '',
        d: '07/10/2016',
        ty: 'Biên bản kiểm tra',
        tg: 'Phòng Nội vụ huyện Tân Phú',
        toSo: '10',
        loaiBan: 'Bản sao'
      },
      {
        p: '006.jpg',
        so: '',
        d: '22/10/2016',
        ty: 'Bảng phân công Tổ kiểm tra công vụ xã Phú Lộc',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        toSo: '11',
        loaiBan: 'Bản gốc'
      },
      {
        p: '007.jpg',
        so: '',
        d: '2016',
        ty: 'Biên bản làm việc',
        tg: 'Đoàn thanh tra - Sở Nội vụ tỉnh Đồng Nai',
        toSo: '12',
        loaiBan: 'Bản sao'
      }
    ]
  });

  // 3. PL_2016_16L
  await processDossier({
    dosId: 'PL_2016_16L',
    title: 'GIẢI QUYẾT CHẾ ĐỘ 1 LẦN',
    year: '2016',
    skipFiles: ['001.jpg'],
    rowsConfig: [
      {
        p: '002.jpg',
        so: '',
        d: '20/05/2016',
        ty: 'Đơn xin hưởng trợ cấp nghỉ việc theo quy định',
        tg: 'Nguyễn Văn Nghiên',
        toSo: '01-04',
        loaiBan: 'Bản gốc'
      },
      {
        p: '003.jpg',
        so: '45/TTr-UBND',
        d: '31/05/2016',
        ty: 'Tờ trình về việc đề nghị giải quyết chế độ chính sách đối với cán bộ, công chức và những người hoạt động không chuyên trách cấp xã, ấp nghỉ việc lâu năm',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        toSo: '05',
        loaiBan: 'Bản chính'
      },
      {
        p: '004.jpg',
        so: '',
        d: '31/05/2016',
        ty: 'Danh sách đề nghị hưởng chế độ trợ cấp một lần (Kèm theo tờ trình số 45/TTr-UBND ngày 31/05/2016 của UBND xã Phú Lộc)',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        toSo: '06',
        loaiBan: 'Bản chính'
      },
      {
        p: '005.jpg',
        so: '',
        d: '25/05/2016',
        ty: 'Biên bản về việc giải quyết chế độ chính sách đối với cán bộ, công chức và những người hoạt động không chuyên trách cấp xã, ấp nghỉ việc lâu năm',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        toSo: '07',
        loaiBan: 'Bản chính'
      },
      {
        p: '006.jpg',
        so: '',
        d: '20/05/2016',
        ty: 'Đơn xin hưởng trợ cấp nghỉ việc theo quy định',
        tg: 'Phạm Hữu Nhượng',
        toSo: '08',
        loaiBan: 'Bản gốc'
      },
      {
        p: '007.jpg',
        so: '84/TTr-UBND',
        d: '25/08/2016',
        ty: 'Tờ trình về việc đề nghị giải quyết chế độ chính sách đối với cán bộ, công chức và những người hoạt động không chuyên trách cấp xã, ấp nghỉ việc lâu năm (lần 2)',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        toSo: '09-10',
        loaiBan: 'Bản sao'
      },
      {
        p: '008.jpg',
        so: '',
        d: '19/08/2016',
        ty: 'Giấy xác nhận quá trình công tác',
        tg: 'Đoàn Hữu Huynh',
        toSo: '11',
        loaiBan: 'Bản sao'
      },
      {
        p: '009.jpg',
        so: '',
        d: '19/08/2016',
        ty: 'Giấy xác nhận quá trình công tác',
        tg: 'Nguyễn Văn Đam',
        toSo: '12',
        loaiBan: 'Bản sao'
      },
      {
        p: '010.jpg',
        so: '27/TB-UBND',
        d: '20/08/2015',
        ty: 'Thông báo về việc tiếp tục rà soát hồ sơ giải quyết chế độ chính sách đối với cán bộ, công chức và những người hoạt động không chuyên trách cấp xã, ấp nghỉ việc lâu năm',
        tg: 'Ủy ban nhân dân xã Phú Lộc',
        toSo: '13',
        loaiBan: 'Bản chính'
      },
      {
        p: '011.jpg',
        so: '1258/UBND-NC',
        d: '19/08/2015',
        ty: 'Công văn về việc tiếp tục rà soát hồ sơ giải quyết chế độ chính sách đối với CBCC cấp xã nghỉ việc lâu năm',
        tg: 'Ủy ban nhân dân huyện Tân Phú',
        toSo: '14',
        loaiBan: 'Bản sao'
      }
    ]
  });

  // 4. PL_2016_16A
  const wbA = new ExcelJS.Workbook();
  await wbA.xlsx.readFile(path.join(P_RAW_EXCEL, 'PL_2016_16A.xlsx'));
  const wsA = wbA.worksheets[0];
  const starts16A = [
    1, 3, 17, 21, 30, 33, 41, 45, 46, 47, 49, 61, 73, 74, 76,
    77, 79, 86, 87, 88, 92, 94, 96, 99, 101, 102, 104, 108, 120, 121,
    122, 125, 126, 130, 135, 138, 139, 140, 142, 143, 146, 149, 155, 159
  ];
  const finalEndA = 161;

  const rowsConfig16A = [];
  for (let i = 0; i < starts16A.length; i++) {
    const photoNum = i + 2;
    const fStr = String(photoNum).padStart(3, '0') + '.jpg';
    const start = starts16A[i];
    const end = (i < starts16A.length - 1) ? starts16A[i + 1] - 1 : finalEndA;
    const toSo = (start === end) ? String(start).padStart(2, '0') : `${String(start).padStart(2, '0')}-${String(end).padStart(2, '0')}`;

    // Read raw row from Excel (starts at row 8 for photo 002)
    const rawRow = wsA.getRow(i + 8);
    let so = rawRow.getCell(2).text?.trim() || '';
    let d = rawRow.getCell(3).text?.trim() || '';
    let ty = rawRow.getCell(4).text?.trim() || '';
    let tg = rawRow.getCell(5).text?.trim() || 'Ủy ban nhân dân xã Phú Lộc';
    let loaiBan = rawRow.getCell(7).text?.trim() || 'Bản gốc';

    // Specific corrections from visual inspection:
    if (photoNum === 15) {
      so = '138/BC-UBND';
      d = '25/10/2016';
    } else if (photoNum === 22) {
      so = '146/BC-UBND';
      d = '08/11/2016';
      ty = 'Báo cáo Kết quả công tác thi hành án hình sự và công tác tái hòa nhập cộng đồng năm 2016';
    } else if (photoNum === 23) {
      so = '146/BC-UBND';
      d = '11/11/2016';
      tg = 'Ban Chỉ đạo PCCC&CNCH xã Phú Lộc';
    } else if (photoNum === 24) {
      so = '145/BC-UBND';
      d = '15/11/2016';
    } else if (photoNum === 44) {
      so = '171/BC-UBND';
      d = '31/12/2016';
    } else if (photoNum === 45) {
      so = '154/BC-UBND';
      d = '2016';
    }

    const files = (photoNum === 45) ? ['045.jpg', '046.jpg'] : [fStr];

    rowsConfig16A.push({
      p: fStr,
      files: files,
      so: so,
      d: d,
      ty: ty,
      tg: tg,
      toSo: toSo,
      loaiBan: loaiBan
    });
  }

  await processDossier({
    dosId: 'PL_2016_16A',
    title: 'BÁO CÁO',
    year: '2016',
    skipFiles: ['001.jpg', '046.jpg'],
    rowsConfig: rowsConfig16A
  });

  console.log('\n========================================\nALL BATCH 2016-1 DOSSIERS PROCESSED SUCCESSFULLY!');
}

run().catch(console.error);
