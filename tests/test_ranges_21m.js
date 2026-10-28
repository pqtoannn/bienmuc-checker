import fs from 'fs';

const starts21m = [
  { img: '002.jpg', start: 1 },
  { img: '003.jpg', start: 2 },
  { img: '004.jpg', start: 3 },
  { img: '005.jpg', start: 5 },
  { img: '006.jpg', start: 6 },
  { img: '007.jpg', start: 8 },
  { img: '008.jpg', start: 10 },
  { img: '009.jpg', start: 11 },
  { img: '010.jpg', start: 12 },
  { img: '011.jpg', start: 13 },
  { img: '012.jpg', start: 15 },
  { img: '013.jpg', start: 16 },
  { img: '014.jpg', start: 18 },
  { img: '015.jpg', start: 20 },
  { img: '016.jpg', start: 22 },
  { img: '017.jpg', start: 23 },
  { img: '018.jpg', start: 24 },
  { img: '019.jpg', start: 25 },
  { img: '020.jpg', start: 26 },
  { img: '021.jpg', start: 28 },
  { img: '022.jpg', start: 29 },
  { img: '023.jpg', start: 30 },
  { img: '024.jpg', start: 31 },
  { img: '025.jpg', start: 32 },
  { img: '026.jpg', start: 33 },
  { img: '027.jpg', start: 34 },
  { img: '028.jpg', start: 35 },
  { img: '029.jpg', start: 36 },
  { img: '030.jpg', start: 37 },
  { img: '031.jpg', start: 38 },
  { img: '032.jpg', start: 39 },
  { img: '033.jpg', start: 40 },
  { img: '034.jpg', start: 41 },
  { img: '035.jpg', start: 42 },
  { img: '036.jpg', start: 43 },
  { img: '037.jpg', start: 44 },
  { img: '038.jpg', start: 45 },
  { img: '039.jpg', start: 46 },
  { img: '040.jpg', start: 47 },
  { img: '041.jpg', start: 48 },
  { img: '042.jpg', start: 50 },
  { img: '043.jpg', start: 52 },
  { img: '044.jpg', start: 54 },
  { img: '045.jpg', start: 56 },
  { img: '046.jpg', start: 58 },
  { img: '047.jpg', start: 59 },
  { img: '048.jpg', start: 60 },
  { img: '049.jpg', start: 61 },
  { img: '050.jpg', start: 62 },
  { img: '051.jpg', start: 63 },
  { img: '052.jpg', start: 64 },
  { img: '053.jpg', start: 65 },
  { img: '054.jpg', start: 66 },
  { img: '055.jpg', start: 68 },
  { img: '056.jpg', start: 69 },
  { img: '057.jpg', start: 70 },
  { img: '058.jpg', start: 71, end: 71 }
];

for (let i = 0; i < starts21m.length; i++) {
  const cur = starts21m[i];
  const next = starts21m[i + 1];
  let end = next ? next.start - 1 : (cur.end || cur.start);
  cur.range = (cur.start === end) ? String(cur.start).padStart(2, '0') : (String(cur.start).padStart(2, '0') + '-' + String(end).padStart(2, '0'));
  cur.count = end - cur.start + 1;
}

console.log('Total documents in 21m:', starts21m.length);
console.log('Total sheets in 21m:', starts21m[starts21m.length - 1].start + starts21m[starts21m.length - 1].count - 1);
let err = false;
for (let i = 0; i < starts21m.length - 1; i++) {
  if (starts21m[i].start + starts21m[i].count !== starts21m[i + 1].start) {
    console.log(`Gap at ${i}`);
    err = true;
  }
}
if (!err) console.log('21m is 100% GAPLESS from 01 to 71!');
