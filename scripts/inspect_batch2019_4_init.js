import fs from 'fs';

for (const d of ['PL_2019_19G', 'PL_2019_19I']) {
  const pDir = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/' + d;
  const jPath = 'C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/' + d + '.job.json';
  const pCount = fs.existsSync(pDir) ? fs.readdirSync(pDir).length : 'no dir';
  const jExists = fs.existsSync(jPath);
  let rowsCount = 0;
  let sampleRows = [];
  if (jExists) {
    const job = JSON.parse(fs.readFileSync(jPath, 'utf8'));
    rowsCount = job.data && job.data.rows ? job.data.rows.length : 0;
    sampleRows = job.data && job.data.rows ? job.data.rows.slice(0, 3) : [];
  }
  console.log('=== ' + d + ' ===');
  console.log('Photos count: ' + pCount);
  console.log('Job exists: ' + jExists);
  console.log('Rows count: ' + rowsCount);
  console.log('Sample rows:', JSON.stringify(sampleRows, null, 2));
}
