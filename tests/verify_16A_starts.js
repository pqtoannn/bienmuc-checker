const starts16A = [
  // Photo 002: 123/BC-UBND
  1,
  // Photo 003: 124/BC-UBND
  3,
  // Photo 004: 125/BC-UBND
  17,
  // Photo 005: 126/BC-UBND
  21,
  // Photo 006: 127/BC-UBND
  30,
  // Photo 007: 128/BC-UBND
  33,
  // Photo 008: 129/BC-UBND
  41,
  // Photo 009: 130/BC-UBND
  45,
  // Photo 010: 131/BC-UBND
  46,
  // Photo 011: 132/BC-UBND
  47,
  // Photo 012: 133/BC-UBND
  49,
  // Photo 013: 134/BC-UBND
  61,
  // Photo 014: 136/BC-UBND
  73,
  // Photo 015: 138/BC-UBND
  74,
  // Photo 016: 139/BC-UBND
  76,
  // Photo 017: 140/BC-UBND
  77,
  // Photo 018: 141/BC-UBND
  79,
  // Photo 019: 142/BC-UBND
  86,
  // Photo 020: 143/BC-UBND
  87,
  // Photo 021: 144/BC-UBND
  88,
  // Photo 022: 145/BC-UBND
  92,
  // Photo 023: 145B/BC-UBND (or similar)
  94,
  // Photo 024: 145C/BC-UBND
  96,
  // Photo 025: 146/BC-UBND
  99,
  // Photo 026: 147/BC-UBND
  101,
  // Photo 027: 148/BC-UBND
  102,
  // Photo 028: 149/BC-UBND
  104,
  // Photo 029: 150/BC-UBND
  108,
  // Photo 030: 155/BC-UBND
  120,
  // Photo 031: 116/BC-UBND
  121,
  // Photo 032: 157/BC-BCĐ
  122,
  // Photo 033: 158/BC-UBND
  125,
  // Photo 034: 153/BC-UBND
  126,
  // Photo 035: 161/BC-UBND
  130,
  // Photo 036: 160/BC-UBND
  135,
  // Photo 037: 162/BC-UBND
  138,
  // Photo 038: 163/BC-UBND
  139,
  // Photo 039: 164/BC-UBND
  140,
  // Photo 040: 166/BC-UBND
  142,
  // Photo 041: 168/BC-UBND
  143,
  // Photo 042: 169/BC-UBND
  146,
  // Photo 043: 170/BC-UBND
  149,
  // Photo 044: 171/BC-UBND
  155,
  // Photo 045: 154/BC-UBND (+ 046 merged)
  159
];

console.log('Total documents:', starts16A.length);
const finalEnd = 161;

const ranges = [];
for (let i = 0; i < starts16A.length; i++) {
  const start = starts16A[i];
  const end = (i < starts16A.length - 1) ? starts16A[i + 1] - 1 : finalEnd;
  const sStr = String(start).padStart(2, '0');
  const eStr = String(end).padStart(2, '0');
  ranges.push(start === end ? sStr : `${sStr}-${eStr}`);
}

console.log('Generated ranges:');
ranges.forEach((r, idx) => console.log(`Doc ${idx + 1} (Photo ${String(idx + 2).padStart(3, '0')}): ${r}`));
