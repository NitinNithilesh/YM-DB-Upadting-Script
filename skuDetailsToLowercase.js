async function main() {
    const Excel = require('exceljs');
    const prompt = require('prompt-sync')();
    const orgDbFile = 'sku_details.csv';
    const sheetToRead = 'sheet1';
    const orgDb = new Excel.Workbook();

    let rowsInOldDbFile = Number(prompt('Number of rows in main db file : ')) + 1;

    // let rowsInOldDbFile = 162 + 1;

    await orgDb.csv.readFile(orgDbFile);

    let orgDbWorksheet = orgDb.getWorksheet(sheetToRead);

    async function changeToLowerCase(value) {
        if (value != null || value != undefined) {
            value = await value.toString();
            value = await value.toLowerCase();
            return value.trim();
        }
        return value;
    }

    for (let i = 1; i < rowsInOldDbFile; i++) {
        let skuId = orgDbWorksheet.getRow(i).getCell(1).value;
        skuId = await changeToLowerCase(skuId);
        orgDbWorksheet.getRow(i).getCell(1).value = skuId;
    }

    console.log('Done!');
    await orgDb.csv.writeFile(orgDbFile);

    return;
}

main();