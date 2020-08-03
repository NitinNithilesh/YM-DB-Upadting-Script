async function main() {
    const Excel = require('exceljs')();
    const prompt = require('prompt-sync')();
    const orgDbFile = 'test.csv';
    const newDbFile = 'test_db.csv';
    const sheetToRead = 'sheet1';
    const orgDb = new Excel.Workbook();
    const newDb = new Excel.Workbook();

    const rowsInOldDbFile = Number(prompt('Number of rows in old db file : ')) + 1;
    const columnsInOldDbFile = Number(prompt('Number of columns in old db file : ')) + 1;
    const rowsInNewDbFile = Number(prompt('Number of rows in new db file : ')) + 1;
    const columnsInNewDbFile = Number(prompt('Number of columns in new db file : ')) + 1;

    // const rowsInOldDbFile = 147 + 1;
    // const columnsInOldDbFile = 135 + 1;
    // const rowsInNewDbFile = 5 + 1;
    // const columnsInNewDbFile = 5 + 1;

    let skuRow;
    let newObj = {};

    await orgDb.csv.readFile(orgDbFile);
    await newDb.csv.readFile(newDbFile);

    let orgDbWorksheet = orgDb.getWorksheet(sheetToRead);
    let newDbWorksheet = newDb.getWorksheet(sheetToRead);

    await changeEntireNewDatasetIntoLowerCase();
    await changeEntireOldDatasetIntoLowerCase();

    async function changeToLowerCase(value) {
        value = await value.toString();
        value = await value.toLowerCase();
        return value.trim();
    }

    async function ifRowAvailable(skuId) {
        let skuRowNewDb;
        let available = false;
        for (let i = 2; i < rowsInNewDbFile; i++) {
            skuRowNewDb = newDbWorksheet.getRow(i).getCell(1).value;
            skuRowNewDb = await changeToLowerCase(skuRowNewDb);
            if (skuRowNewDb == skuId) {
                available = true;
            }
        }
        return available;
    }

    async function checkCd(cdCode) {
        let available = false;
        for (let j = 4; j < columnsInOldDbFile; j++) {
            let cdColumn = newDbWorksheet.getRow(1).getCell(j).value;
            if (cdColumn == cdCode) {
                available = true
            }
        }
        return available;
    }

    async function findCellPositionInOldDb(pos) {
        for (let i = 2; i < rowsInOldDbFile; i++) {
            skuRow = orgDbWorksheet.getRow(i).getCell(1).value;
            skuRow = await changeToLowerCase(skuRow);
            if (skuRow == pos.rowValue) {
                for (let j = 4; j < columnsInOldDbFile; j++) {
                    let cdColumn = orgDbWorksheet.getRow(1).getCell(j).value;
                    if (cdColumn == pos.columnValue) {
                        let valueToUpdate = newDbWorksheet.getRow(i).getCell(j).value;
                        let posObj = {
                            "i": i,
                            "j": j
                        }
                        return posObj;
                    }
                }
            }
        }
    }

    async function findOldCellPosition(newObj) {
        let pos = await findCellPositionInOldDb(newObj);
        let i = pos.i;
        let j = pos.j;
        let row = orgDbWorksheet.getRow(i);
        row.getCell(j).value = await newObj.valueInCell;
        return row.commit();
    }

    async function findCellPositionInNewDb(sskuRow, ccdColumn) {
        for (let i = 2; i < rowsInNewDbFile; i++) {
            skuRow = orgDbWorksheet.getRow(i).getCell(1).value;
            skuRow = await changeToLowerCase(skuRow);
            if (skuRow == sskuRow) {
                for (let j = 4; j < columnsInNewDbFile; j++) {
                    let cdColumn = newDbWorksheet.getRow(1).getCell(j).value;
                    if (cdColumn == ccdColumn) {
                        let valueToUpdate = newDbWorksheet.getRow(i).getCell(j).value;
                        return valueToUpdate;
                    }
                }
            }
        }
    }

    async function findNewCellPosition(skuRow, cdColumn) {
        let pos = await findCellPositionInNewDb(skuRow, cdColumn);
        return pos;
    }

    async function changeEntireNewDatasetIntoLowerCase() {
        for (let i = 2; i < rowsInNewDbFile; i++) {
            let row = newDbWorksheet.getRow(i);
            row.getCell(1).value = await changeToLowerCase(newDbWorksheet.getRow(i).getCell(1).value);
            row.commit();
        }
        await newDb.csv.writeFile("test_db.csv");
    }

    async function changeEntireOldDatasetIntoLowerCase() {
        for (let i = 2; i < rowsInOldDbFile; i++) {
            let row = orgDbWorksheet.getRow(i);
            row.getCell(1).value = await changeToLowerCase(orgDbWorksheet.getRow(i).getCell(1).value);
            row.commit();
        }
        await newDb.csv.writeFile("test.csv");
    }

    for (let i = 2; i < rowsInOldDbFile; i++) {
        skuRow = orgDbWorksheet.getRow(i).getCell(1).value;
        skuRow = await changeToLowerCase(skuRow);
        let rowAvailable = await ifRowAvailable(skuRow);
        if (rowAvailable) {
            for (let j = 4; j < columnsInOldDbFile; j++) {
                let cdColumn = orgDbWorksheet.getRow(1).getCell(j).value;
                let cdAvailable = await checkCd(cdColumn);
                if (cdAvailable) {
                    console.log(`${i} ${j}`);
                    let posInNewDb = await findNewCellPosition(skuRow, cdColumn);
                    let valueInCell = posInNewDb;
                    newObj = {
                        "rowId": i,
                        "columnId": j,
                        "rowValue": await changeToLowerCase(skuRow),
                        "columnValue": cdColumn,
                        "valueInCell": valueInCell
                    };
                    console.log(newObj);
                    await findOldCellPosition(newObj);
                }
            }
        }
    }

    await orgDb.csv.writeFile("test.csv");
    await newDb.csv.writeFile("test_db.csv");

    return;
}

main();