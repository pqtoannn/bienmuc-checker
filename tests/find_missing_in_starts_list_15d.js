import xlsx from 'xlsx';

const wb = xlsx.readFile('C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/PL_2015_15D.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const activeSTTs = [];
for (let r = 5; r <= 150; r++) {
  const stt = parseInt(rows[r][0], 10);
  if (stt === 1 || stt === 92 || stt === 101 || stt === 146) continue;
  activeSTTs.push(stt);
}

console.log('Active STTs count:', activeSTTs.length);

// Compare activeSTTs with the list
const listedSTTs = [];
// 1 to 44: STTs 2 to 45 (44 items)
for (let s = 2; s <= 91; s++) {
  listedSTTs.push(s);
}
// STT 93 to 100
for (let s = 93; s <= 100; s++) {
  listedSTTs.push(s);
}
// STT 102 to 145
for (let s = 102; s <= 145; s++) {
  listedSTTs.push(s);
}
console.log('listedSTTs count:', listedSTTs.length);

const diff = activeSTTs.filter(s => !listedSTTs.includes(s));
console.log('Diff active vs listed:', diff);
