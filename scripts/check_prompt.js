import fs from 'fs';

const p = fs.readFileSync('D:/git_clone_ocr_bienmuc/bienmuc/lib/bienmuc-prompt.js', 'utf8');
console.log('bienmuc-prompt length:', p.length);
console.log(p.slice(0, 800));
