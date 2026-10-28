import fs from 'fs';

const startsD = [
  // 1 to 20: 002.jpg to 021.jpg (20 items)
  1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18, 25, 26, 27, 28, 33, 34,
  // 21 to 40: 022.jpg to 041.jpg (20 items)
  37, 40, 41, 45, 50, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70,
  // 41 to 60: 042.jpg to 061.jpg (20 items)
  72, 73, 74, 75, 76, 80, 83, 84, 85, 86, 87, 89, 90, 91, 92, 96, 97, 98, 99, 101, // wait, let's check 042 to 061
];
// Let's do it cleanly by checking each doc
"