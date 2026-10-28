const starts = {
  1: 1, 2: 17, 3: 36, 4: 43, 5: 57, 6: 62, 7: 65, 8: 68, 9: 83, 10: 84,
  11: 88, 12: 90, 13: 93, 14: 98, 15: 106, 16: 108, 17: 121, 18: 127, 19: 129, 20: 136,
  21: 154
};

const keys = Object.keys(starts).map(Number).sort((a,b)=>a-b);
const ranges = {};

for (let i = 0; i < keys.length; i++) {
  const p = keys[i];
  const startNum = starts[p];
  let endNum;
  if (i === keys.length - 1) {
    endNum = 155; // 2-page report
  } else {
    endNum = starts[keys[i + 1]] - 1;
  }
  
  if (startNum === endNum) {
    ranges[p] = String(startNum).padStart(2, '0');
  } else {
    ranges[p] = `${String(startNum).padStart(2, '0')}-${String(endNum).padStart(2, '0')}`;
  }
}

let prevEnd = 0;
let gapCount = 0;
for (const p of keys) {
  const r = ranges[p];
  const parts = r.split('-').map(Number);
  const start = parts[0];
  const end = parts.length > 1 ? parts[1] : parts[0];
  if (prevEnd > 0 && start !== prevEnd + 1) {
    console.log(`GAP at photo ${p}: prevEnd=${prevEnd}, start=${start}`);
    gapCount++;
  }
  console.log(`Doc ${p}: sheets ${r}`);
  prevEnd = end;
}
console.log(`Total active docs: ${keys.length}`);
console.log(`Final sheet: ${prevEnd}`);
console.log(`Gaps detected: ${gapCount}`);
