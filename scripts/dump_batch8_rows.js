import fs from 'fs';

function dumpRows(dossier) {
  const jobPath = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/${dossier}.job.json`;
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
  console.log(`\n================ ${dossier} (Total rows: ${job.data?.rows?.length}) ================`);
  console.log("Dossier Info:", {
    duAnTen: job.duAnTen,
    soHoSo: job.soHoSo,
    tenHoSo: job.data?.tenHoSo,
    thoiGianHoSo: job.data?.thoiGianHoSo,
    namGiaiDoan: job.data?.namGiaiDoan,
    thbq: job.data?.thbq
  });

  job.data?.rows?.forEach((r, idx) => {
    console.log(`[${idx+1}] File: ${r.sourceFileNames?.join(', ')} | Số: '${r.soKyHieuVanBan}' | Ngày: '${r.ngayThangVanBan}' | Tác giả: '${r.tacGiaVanBan}' | Tờ: '${r.toSoTrangSo}' | Trích yếu: '${r.tenLoaiTrichYeu}' | Loại: '${r.loaiBan}' | Ghi chú: '${r.ghiChu}'`);
  });
}

dumpRows('PL_2019_19Q');
dumpRows('PL_2019_19R');
