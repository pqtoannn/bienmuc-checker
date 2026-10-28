import fs from 'fs';

const content = fs.readFileSync('D:/git_clone_ocr_bienmuc/bienmuc/lib/ocr-folder-job.js', 'utf8');
console.log('ocr-folder-job length:', content.length);
console.log(content.slice(0, 1500));
