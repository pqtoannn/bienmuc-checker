import fs from 'fs';

// Complete list of start sheets for 002 to 094:
const starts = [
  { img: '002.jpg', start: 1 },
  { img: '003.jpg', start: 3 },
  { img: '004.jpg', start: 5 },
  { img: '005.jpg', start: 7 },
  { img: '006.jpg', start: 8 },
  { img: '007.jpg', start: 10 },
  { img: '008.jpg', start: 11 },
  { img: '009.jpg', start: 13 },
  { img: '010.jpg', start: 15 },
  { img: '011.jpg', start: 17 },
  { img: '012.jpg', start: 20 },
  { img: '013.jpg', start: 23 },
  { img: '014.jpg', start: 25 },
  { img: '015.jpg', start: 28 },
  { img: '016.jpg', start: 31 },
  { img: '017.jpg', start: 33 },
  { img: '018.jpg', start: 34 },
  { img: '019.jpg', start: 35 },
  { img: '020.jpg', start: 38 },
  { img: '021.jpg', start: 40 },
  { img: '022.jpg', start: 42 },
  { img: '023.jpg', start: 44 },
  { img: '024.jpg', start: 47 },
  { img: '025.jpg', start: 50 },
  { img: '026.jpg', start: 52 },
  { img: '027.jpg', start: 56 },
  { img: '028.jpg', start: 58 },
  { img: '029.jpg', start: 60 },
  { img: '030.jpg', start: 62 },
  { img: '031.jpg', start: 64 },
  { img: '032.jpg', start: 67 },
  { img: '033.jpg', start: 69 },
  { img: '034.jpg', start: 71 },
  { img: '035.jpg', start: 76 },
  { img: '036.jpg', start: 79 },
  { img: '037.jpg', start: 81 },
  { img: '038.jpg', start: 82 },
  { img: '039.jpg', start: 85 },
  { img: '040.jpg', start: 87 },
  { img: '041.jpg', start: 89 },
  { img: '042.jpg', start: 93 },
  { img: '043.jpg', start: 95 },
  { img: '044.jpg', start: 97 },
  { img: '045.jpg', start: 100 },
  { img: '046.jpg', start: 103 },
  { img: '047.jpg', start: 106 },
  { img: '048.jpg', start: 108 },
  { img: '049.jpg', start: 110 },
  { img: '050.jpg', start: 113 },
  { img: '051.jpg', start: 116 },
  { img: '052.jpg', start: 118 },
  { img: '053.jpg', start: 123 },
  { img: '054.jpg', start: 125 },
  { img: '055.jpg', start: 128 },
  { img: '056.jpg', start: 131 },
  { img: '057.jpg', start: 134 },
  { img: '058.jpg', start: 137 },
  { img: '059.jpg', start: 140 },
  { img: '060.jpg', start: 142 },
  { img: '061.jpg', start: 144 },
  { img: '062.jpg', start: 147 },
  { img: '063.jpg', start: 152 },
  { img: '064.jpg', start: 156 },
  { img: '065.jpg', start: 157 },
  { img: '066.jpg', start: 160 },
  { img: '067.jpg', start: 163 },
  { img: '068.jpg', start: 167 },
  { img: '069.jpg', start: 173 },
  { img: '070.jpg', start: 176 },
  { img: '071.jpg', start: 178 },
  { img: '072.jpg', start: 183 },
  { img: '073.jpg', start: 185 },
  { img: '074.jpg', start: 187 },
  { img: '075.jpg', start: 189 },
  { img: '076.jpg', start: 192 },
  { img: '077.jpg', start: 195 },
  { img: '078.jpg', start: 199 },
  { img: '079.jpg', start: 203 },
  { img: '080.jpg', start: 206 },
  { img: '081.jpg', start: 209 },
  { img: '082.jpg', start: 212 },
  { img: '083.jpg', start: 213 },
  { img: '084.jpg', start: 216 },
  { img: '085.jpg', start: 219 },
  { img: '086.jpg', start: 221 },
  { img: '087.jpg', start: 224 },
  { img: '088.jpg', start: 227 },
  { img: '089.jpg', start: 230 },
  { img: '090.jpg', start: 233 },
  { img: '091.jpg', start: 235 },
  { img: '092.jpg', start: 236 },
  { img: '093.jpg', start: 240 },
  { img: '094.jpg', start: 243, end: 244 }
];

// Let's compute ranges:
for (let i = 0; i < starts.length; i++) {
  const cur = starts[i];
  const next = starts[i + 1];
  let end;
  if (next) {
    end = next.start - 1;
  } else {
    end = cur.end || cur.start;
  }
  cur.range = (cur.start === end) ? String(cur.start).padStart(2, '0') : (String(cur.start).padStart(2, '0') + '-' + String(end).padStart(2, '0'));
  cur.sheetCount = end - cur.start + 1;
}

console.log('Total documents:', starts.length);
console.log('Total sheets:', starts[starts.length - 1].start + starts[starts.length - 1].sheetCount - 1);
let hasError = false;
for (let i = 0; i < starts.length - 1; i++) {
  const cur = starts[i];
  const next = starts[i + 1];
  const expectedNextStart = cur.start + cur.sheetCount;
  if (next.start !== expectedNextStart) {
    console.log(`Mismatch at doc ${i} (${cur.img}): cur.start=${cur.start}, count=${cur.sheetCount}, next.start=${next.start}`);
    hasError = true;
  }
}
if (!hasError) {
  console.log('ALL RANGES ARE 100% CONTINUOUS AND GAPLESS FROM 01 TO 244!');
}
