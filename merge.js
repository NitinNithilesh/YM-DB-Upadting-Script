async function main() {
    const Excel = require('exceljs');
    const prompt = require('prompt-sync')();
    const orgDbFile = 'main_db.csv';
    const newDbFile = 'test_db.csv';
    const sheetToRead = 'sheet1';
    const orgDb = new Excel.Workbook();
    const newDb = new Excel.Workbook();

    let rowsInOldDbFile = Number(prompt('Number of rows in old db file : ')) + 1;
    let columnsInOldDbFile = Number(prompt('Number of columns in old db file : ')) + 1;
    let rowsInNewDbFile = Number(prompt('Number of rows in new db file : ')) + 1;
    let columnsInNewDbFile = Number(prompt('Number of columns in new db file : ')) + 1;

    // let rowsInOldDbFile = 162 + 1;
    // let columnsInOldDbFile = 137 + 1;
    // let rowsInNewDbFile = 17 + 1;
    // let columnsInNewDbFile = 8 + 1;

    let skuRow;
    let oldDbColumnsArray = [];
    let oldDbRowsArray = [];
    let newDbColumnsArray = [];
    let newDbRowsArray = [];
    let newDbRowsProductsArray = [];
    let newDbRowsUserArray = [];
    let newObj = {};

    await orgDb.csv.readFile(orgDbFile);
    await newDb.csv.readFile(newDbFile);

    let orgDbWorksheet = orgDb.getWorksheet(sheetToRead);
    let newDbWorksheet = newDb.getWorksheet(sheetToRead);

    await changeEntireNewDatasetIntoLowerCase();
    await changeEntireOldDatasetIntoLowerCase();

    async function oldDbColumns() {
        for (let i = 1; i < columnsInOldDbFile; i++) {
            oldDbColumnsArray.push(orgDbWorksheet.getRow(1).getCell(i).value);
        }
        return;
    }

    async function oldDbRows() {
        for (let i = 1; i < rowsInOldDbFile; i++) {
            oldDbRowsArray.push(orgDbWorksheet.getRow(i).getCell(1).value);
        }
        return;
    }

    async function newDbColumns() {
        for (let i = 1; i < columnsInNewDbFile; i++) {
            newDbColumnsArray.push(newDbWorksheet.getRow(1).getCell(i).value);
        }
        return;
    }

    async function newDbRows() {
        for (let i = 1; i < rowsInNewDbFile; i++) {
            newDbRowsArray.push(newDbWorksheet.getRow(i).getCell(1).value);
            newDbRowsProductsArray.push(newDbWorksheet.getRow(i).getCell(2).value);
            newDbRowsUserArray.push(newDbWorksheet.getRow(i).getCell(3).value);
        }
        return;
    }

    async function changeToLowerCase(value) {
        if (value != null || value != undefined) {
            value = await value.toString();
            value = await value.toLowerCase();
            return value.trim();
        }
        return value;
    }

    async function cleanOldData() {
        for (let i = 1; i < rowsInOldDbFile; i++) {
            let row = orgDbWorksheet.getRow(i).getCell(1).value;
            await changeToLowerCase(row);
        }
        await orgDb.csv.writeFile(orgDbFile);
    }

    async function cleanNewData() {
        for (let i = 1; i < rowsInNewDbFile; i++) {
            let row = newDbWorksheet.getRow(i).getCell(1).value;
            await changeToLowerCase(row);
        }
        await newDb.csv.writeFile(newDbFile);
    }

    async function checkForNewColumns() {
        for (let i = 0; i < newDbColumnsArray.length; i++) {
            let index = oldDbColumnsArray.indexOf(newDbColumnsArray[i]);
            if (index == -1) {
                orgDbWorksheet.getRow(1).getCell(columnsInOldDbFile).value = newDbColumnsArray[i];
                columnsInOldDbFile = columnsInOldDbFile + 1;
            }
            await orgDb.csv.writeFile(orgDbFile);
        }
        return;
    }

    async function checkForNewRows() {
        for (let i = 0; i < newDbRowsArray.length; i++) {
            let index = oldDbRowsArray.indexOf(newDbRowsArray[i]);
            if (index == -1) {
                orgDbWorksheet.getRow(rowsInOldDbFile).getCell(1).value = newDbRowsArray[i];
                orgDbWorksheet.getRow(rowsInOldDbFile).getCell(2).value = newDbRowsProductsArray[i];
                orgDbWorksheet.getRow(rowsInOldDbFile).getCell(3).value = newDbRowsUserArray[i];
                rowsInOldDbFile = rowsInOldDbFile + 1;
            }
            await orgDb.csv.writeFile(orgDbFile);
        }
        return;
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
                            "i": pos.rowId,
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
        await newDb.csv.writeFile(newDbFile);
    }

    async function changeEntireOldDatasetIntoLowerCase() {
        for (let i = 2; i < rowsInOldDbFile; i++) {
            let row = orgDbWorksheet.getRow(i);
            row.getCell(1).value = await changeToLowerCase(orgDbWorksheet.getRow(i).getCell(1).value);
            row.commit();
        }
        await newDb.csv.writeFile(orgDbFile);
    }

    await cleanOldData();
    await cleanNewData();
    await oldDbColumns();
    await oldDbRows();
    await newDbColumns();
    await newDbRows();
    await checkForNewColumns();
    await checkForNewRows();

    for (let i = 2; i < rowsInOldDbFile; i++) {
        skuRow = orgDbWorksheet.getRow(i).getCell(1).value;
        skuRow = await changeToLowerCase(skuRow);
        let rowAvailable = await ifRowAvailable(skuRow);
        if (rowAvailable) {
            for (let j = 4; j < columnsInOldDbFile; j++) {
                let cdColumn = orgDbWorksheet.getRow(1).getCell(j).value;
                let cdAvailable = await checkCd(cdColumn);
                if (cdAvailable) {
                    let posInNewDb = await findNewCellPosition(skuRow, cdColumn);
                    let valueInCell = posInNewDb;
                    newObj = {
                        rowId: i,
                        columnId: j,
                        rowValue: await changeToLowerCase(skuRow),
                        columnValue: cdColumn,
                        valueInCell: valueInCell
                    };
                    // console.log(newObj);
                    await findOldCellPosition(newObj);
                }
            }
        }
    }

    console.log('Done!');
    await orgDb.csv.writeFile(orgDbFile);
    await newDb.csv.writeFile(newDbFile);
    return;
}

main();