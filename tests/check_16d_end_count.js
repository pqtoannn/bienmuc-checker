import fs from 'fs';

// Let's check docs 120 to 128
const checkList = [
  { idx: 121, img: "125.jpg", rawTo: "192", expected: 192 },
  { idx: 122, img: "126.jpg", rawTo: "193", expected: 193 },
  { idx: 123, img: "127.jpg", rawTo: "194", expected: 194 },
  { idx: 124, img: "128.jpg", rawTo: "195-196", expected: 195 },
  { idx: 125, img: "129.jpg", rawTo: "197-203", expected: 197 },
  { idx: 126, img: "130.jpg", rawTo: "204-206", expected: 204 },
  { idx: 127, img: "131.jpg", rawTo: "207-208", expected: 207 },
  { idx: 128, img: "132.jpg", rawTo: "209-212", expected: 209 },
  { idx: 129, img: "133.jpg", rawTo: "213", expected: 213 }
];
console.log('Count from 125.jpg to 133.jpg is:', checkList.length, 'docs!');
