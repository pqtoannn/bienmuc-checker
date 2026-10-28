import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

async function checkDossier(d) {
    const jobPath = `C:/Users/Toan/Pictures/anh_HS_ch_check/PL_outputOCR/${d}.job.json`;
    const rawExcel = `C:/Users/Toan/Downloads/BienMuc_Phu_Loc_ch_check/${d}.xlsx`;
    
    console.log(`\n=================== ${d} ===================`);
    const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
    console.log("Job keys:", Object.keys(job));
    if (job.data) console.log("Job data keys:", Object.keys(job.data));
    if (job.data && job.data.rows) console.log("job.data.rows length:", job.data.rows.length);
    if (job.rows) console.log("job.rows length:", job.rows.length);

    if (fs.existsSync(rawExcel)) {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(rawExcel);
        const ws = wb.worksheets[0];
        console.log(`Excel sheet name: ${ws.name}, row count: ${ws.rowCount}`);
        for (let r = 1; r <= Math.min(ws.rowCount, 15); r++) {
            const row = ws.getRow(r);
            const vals = [];
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber <= 10) vals.push(cell.value);
            });
            console.log(`Row ${r}:`, JSON.stringify(vals));
        }
    }
}

async function main() {
    await checkDossier('PL_2019_19Q');
    await checkDossier('PL_2019_19R');
}

main().catch(console.error);
