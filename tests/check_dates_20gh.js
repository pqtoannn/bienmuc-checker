import fs from 'fs';

const g = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20G.job.json', 'utf8'));
console.log('20G doc 1 date:', g.data.rows[1].ngayThangVanBan, g.data.rows[1].ngayThangNamVanBan);
console.log('20G last doc date:', g.data.rows[104].ngayThangVanBan, g.data.rows[104].ngayThangNamVanBan);

const h = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20H.job.json', 'utf8'));
console.log('20H doc 1 date:', h.data.rows[1].ngayThangVanBan, h.data.rows[1].ngayThangNamVanBan);
console.log('20H last doc date:', h.data.rows[78].ngayThangVanBan, h.data.rows[78].ngayThangNamVanBan);
