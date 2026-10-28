import fs from 'fs';

// Let's inspect activeScans 002 to 191
const activeScans = [];
for (let i = 2; i <= 191; i++) {
  const f = String(i).padStart(3, '0') + '.jpg';
  if (f === '067.jpg' || f === '072.jpg' || f === '181.jpg') continue;
  activeScans.push(f);
}

// Let's check the old starts15K
const code = fs.readFileSync('scripts/update_and_export_batch2015_4.js', 'utf8');
const match = code.match(/const starts15K = \[([\s\S]*?)\];/);
const oldStarts = match[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

console.log('activeScans:', activeScans.length, 'oldStarts:', oldStarts.length);

// In part 1:
// 002: 1
// 003: 2
// 004: 4
// 005: 8
// 006: 14
// 007: 18
// 008: 20
// 009: 22
// 010: 24
// 011: 26
// 012: 28
// 013: 30
// 014: 31
// 015: 33
// 016: 35
// 017: 39
// 018: 41
// 019: 43
// 020: 44
// 021: 45
// 022: 46
// 023: 47
// 024: 50
// 025: 51
// 026: 52
// 027: 53
// 028: 56
// 029: 57
// 030: 58
// 031: 59
// 032: 60
// 033: 61
// 034: 62
// 035: 63
// 036: 64
// 037: 65
// 038: 66
// 039: 68
// Up to 039: matches exactly oldStarts[0..37]!

// Now let's check 040 to 075:
// In part 2:
// 040: 71 (Wait, is 040 71 or 70? Or 68-70?)
// Let's check what is on 039 and 040:
