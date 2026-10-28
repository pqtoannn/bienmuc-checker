import fs from 'fs';
import path from 'path';

// For 16B:
// Photos: 001.jpg (cover) -> skip
// 002 to 080: documents
// 066 and 067: 067 is duplicate of 066 (synced to tài liệu loại)
// 081 is concluding sheet of 080 (merged into 080)

// For 16K:
// Photos: 001.jpg (scrap note on 002) -> skip (002 is doc 1)
// 002 to 092: documents

console.log('Script template ready');
