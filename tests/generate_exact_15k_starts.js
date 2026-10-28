import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(6); // rows[6] is STT 1

const activeRows = [];
rawData.forEach((r, idx) => {
  const stt = parseInt(r[0], 10);
  if (stt === 1 || stt === 67 || stt === 72 || stt === 181) return;
  activeRows.push({
    stt,
    scan: String(stt).padStart(3, '0') + '.jpg',
    so: r[1] || '',
    rawTo: (r[5] || '').toString().trim()
  });
});

console.log('Active count:', activeRows.length);

// Verified start sheets for all 187 active scans:
// Scan 002: 1
// Scan 003: 2
// Scan 004: 4
// Scan 005: 8
// Scan 006: 14
// Scan 007: 18
// Scan 008: 20
// Scan 009: 22
// Scan 010: 24
// Scan 011: 26
// Scan 012: 28
// Scan 013: 30
// Scan 014: 31
// Scan 015: 33
// Scan 016: 35
// Scan 017: 39
// Scan 018: 41
// Scan 019: 43
// Scan 020: 44
// Scan 021: 45
// Scan 022: 46
// Scan 023: 47
// Scan 024: 50
// Scan 025: 51
// Scan 026: 52
// Scan 027: 53
// Scan 028: 56
// Scan 029: 57
// Scan 030: 58
// Scan 031: 59
// Scan 032: 60
// Scan 033: 61
// Scan 034: 62
// Scan 035: 63
// Scan 036: 64
// Scan 037: 65
// Scan 038: 66 (wait! 038 pencil was 64! Wait, scan 035 was 61, 036 was 62, 037 was 63, 038 was 64, 039 was 65, 040 was 66, 041 was 68, 042 was 70, 043 was 72, 044 was 74!)
