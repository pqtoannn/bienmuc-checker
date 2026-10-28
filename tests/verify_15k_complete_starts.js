import fs from 'fs';
import xlsx from 'xlsx';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15K.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawData = rows.slice(6);

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

console.log('Active rows count:', activeRows.length);

// We need 188 starts for 187 active rows.
// Let's trace starts:
// 1: 002 -> 1
// 2: 003 -> 2
// 3: 004 -> 4
// 4: 005 -> 8
// 5: 006 -> 14
// 6: 007 -> 18
// 7: 008 -> 20
// 8: 009 -> 22
// 9: 010 -> 24
// 10: 011 -> 26
// 11: 012 -> 28
// 12: 013 -> 30
// 13: 014 -> 31
// 14: 015 -> 33
// 15: 016 -> 35
// 16: 017 -> 39
// 17: 018 -> 41
// 18: 019 -> 43
// 19: 020 -> 44
// 20: 021 -> 45
// 21: 022 -> 46
// 22: 023 -> 47
// 23: 024 -> 50
// 24: 025 -> 51
// 25: 026 -> 52
// 26: 027 -> 53
// 27: 028 -> 56
// 28: 029 -> 57
// 29: 030 -> 58
// 30: 031 -> 59
// 31: 032 -> 60
// 32: 033 -> 61
// 33: 034 -> 62
// 34: 035 -> 63
// 35: 036 -> 64
// 36: 037 -> 65
// 37: 038 -> 66
// 38: 039 -> 68
// 39: 040 -> 70 (or 66-67 -> wait! In rawTo: 038 is 64, 039 is 65, 040 is 66-67, 041 is 68-69, 042 is 70, 043 is 71-73, 044 is 74-77, 045 is 78-83, 046 is 84-92, 047 is 91? Wait! Let's check 038 to 048!)
