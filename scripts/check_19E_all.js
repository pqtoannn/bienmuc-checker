import fs from 'fs';

// Let's create an analysis script that checks the start numbers and metadata of PL_2019_19E
const jobE = JSON.parse(fs.readFileSync('C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/PL_2019_19E.job.json', 'utf8'));

// Rows 0 to 72 (73 items):
// Index 0: 001.jpg (cover) -> skip
// Index 1: 002.jpg -> start 1
// ...

console.log('Total images:', jobE.images.length);
console.log('Total rows:', jobE.data.rows.length);
