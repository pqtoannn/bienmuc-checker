import fs from 'fs';
import path from 'path';

for (const d of ['PL_2019_19W', 'PL_2019_19X']) {
  const jobPath = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/${d}.job.json`;
  const photoDir = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_photos/${d}`;
  const rawExcel = `C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/${d}.xlsx`;

  console.log(`\n=== ${d} ===`);
  console.log(`Job exists:`, fs.existsSync(jobPath));
  console.log(`Photo dir exists:`, fs.existsSync(photoDir));
  if (fs.existsSync(photoDir)) {
    const photos = fs.readdirSync(photoDir).filter(f => f.toLowerCase().endsWith('.jpg'));
    console.log(`Photos count:`, photos.length, `First:`, photos[0], `Last:`, photos[photos.length - 1]);
  }
  console.log(`Raw Excel exists:`, fs.existsSync(rawExcel));
  if (fs.existsSync(jobPath)) {
    const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
    console.log(`Job rows:`, job.data?.rows ? job.data.rows.length : 0);
    console.log(`Job images:`, job.images ? job.images.length : 0);
    console.log(`Dossier Title:`, job.data?.tieuDeNghiQuyet || job.data?.tenHoSo);
  }
}
