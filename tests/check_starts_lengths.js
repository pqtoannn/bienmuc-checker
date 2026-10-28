import fs from 'fs';

const src = fs.readFileSync('scripts/update_and_export_batch2015_4.js', 'utf8');

function getArray(name) {
  const startTag = `const ${name} = [`;
  const startIdx = src.indexOf(startTag);
  const endIdx = src.indexOf('];', startIdx);
  const substr = src.slice(startIdx + startTag.length, endIdx);
  return substr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
}

const arrD = getArray('starts15D');
console.log('starts15D length:', arrD.length, 'expected: 145');

const arrF = getArray('starts15F');
console.log('starts15F length:', arrF.length, 'expected: 143');

const arrK = getArray('starts15K');
console.log('starts15K length:', arrK.length, 'expected: 189');
