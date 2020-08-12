# Merge Changes in the New DB with the Old DB

> Merge the new changes in the db with the old db

**Packages to Install**

```shell
$ npm install
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