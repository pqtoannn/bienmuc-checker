import fs from 'fs';
import path from 'path';

const zPhotosDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/PL_2021_21Z';
const files = fs.readdirSync(zPhotosDir).filter(f => f.endsWith('.jpg')).sort();
console.log('PL_2021_21Z photos in folder:', files);

const jobZ = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2021_21Z.job.json', 'utf8'));
console.log('PL_2021_21Z job data:');
console.log(JSON.stringify(jobZ.data, null, 2));
