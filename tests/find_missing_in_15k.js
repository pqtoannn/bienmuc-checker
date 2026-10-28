import fs from 'fs';

const code = fs.readFileSync('scripts/update_and_export_batch2015_4.js', 'utf8');
const match = code.match(/const starts15K = \[([\s\S]*?)\];/);
const starts15K = match[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

console.log('starts15K length:', starts15K.length);

// Active scans: 002 to 191 except 067, 072, 181
const activeScans = [];
for (let i = 2; i <= 191; i++) {
  const f = String(i).padStart(3, '0') + '.jpg';
  if (f === '067.jpg' || f === '072.jpg' || f === '181.jpg') continue;
  activeScans.push(f);
}
console.log('activeScans length:', activeScans.length);

// Let's print out side by side
for (let i = 0; i < Math.max(activeScans.length, starts15K.length); i++) {
  console.log(
    '#' + (i + 1).toString().padStart(3) + ' | ' +
    (activeScans[i] || '---') + ' | start: ' +
    (starts15K[i] !== undefined ? starts15K[i] : '---')
  );
}
