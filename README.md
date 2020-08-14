# Merge changes in the New DB with the Old DB

> Merge the new changes in the db with the old db

**NodeJS**

> Download nodejs from https://nodejs.org/en/download/ and setup the node environment

**Setup npm**

> Setup npm after you install node in your local environment

```shell
$ npm install
```

**Packages to Install**

> Install the following packages after setting-up the node environment

```shell
$ npm i exceljs
$ npm i prompt-sync
```

**How to Run**

```shell
$ node merge.js
```

**Steps To Be Followed**

- Download the Old DB CSV from Yellow Messenger
- Take a backup of that file in a safe folder (For backup if anything goes wrong while feeding the input to the script)
- Copy the downloaded excel in the same folder where the script is present
- Also copy the excel sheet with the data that has to be updated into the same folder
- The excel having the datas to be updated has to be changed into the format specified
- Run the script

**Keywords Used**

> Old DB - The excel having the complete DB data

> New DB - The excel having the new db data

> Number of rows - Total number of the rows in the respective excel

> Number of columns - Total numebr of columns in the respective excel

**More Reference**

> Please refer the file "readme.js" for more details on the internal functions

**Important Note**

> Please make sure that all the files (sku_details, sku_stock, sku_price) and datas are in correct format before uploading. Follow the instructions in "readme.js" ti achive that
