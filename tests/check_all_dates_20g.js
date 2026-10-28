import fs from 'fs';

const g = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2020_20G.job.json', 'utf8'));
const dates = g.data.rows.slice(1, 105).map(r => r.ngayThangVanBan).filter(Boolean);
console.log('20G dates count:', dates.length);
console.log('First 5:', dates.slice(0, 5));
console.log('Last 5:', dates.slice(-5));
