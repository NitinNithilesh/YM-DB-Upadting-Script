`

==============================================================================

README FOR ALL CLARIFICATION ABOUT THIS REPO
--------------------------------------------
Please read this entire file for all the quries in the functions and steps to 
be followed

==============================================================================

Filenames to follow
-------------------
1. Original DB => main_db.js
2. Changes DB => changes_db.js

==============================================================================

Steps to follow
---------------
1. Download the DB from the bot and place it in the same folder of the script 
   with the file name "main_db.js"
2. Download the new changes db and change the sheet into the desired format as 
   mentioned (Mentioned below), also place it in the same folder with the file 
   name "changes_db.csv"
3. Run the script => node merge.js

==============================================================================

Header format for the excel sheets
----------------------------------

** All the sheets that you need to run the script on has to have the below 
   format
---------------------------------------------------
| sku_id | product_name | user_type | cd_codes... |
---------------------------------------------------

** Please remove the columns "insertedDate" and "updatedDate" from the sheet 
   that you have downloaded from the bot db 

==============================================================================

Change sku_id in sku_details to lower case => skuDetailsToLowercase.js
----------------------------------------------------------------------

** This is used to change all the sku_id in the sku_details table into
   lowercase.

** Please use this whenever a new product is getting added in sku_details
   table and make sure that it follows the correct format of naming the 
   sku_id

==============================================================================

Feature Updates
---------------

** v1.0
   Merge the two files with same number of rows and columns

** v2.0
   Merge the files with new cd and products
   Format the sku_id into the desired format that has to be present
   New cd and products will be automatically updated in the main_db sheet

** v3.0
   Option added to change the sku_id in sku_details file also into the 
   lower case for following the same format across all the db

==============================================================================

***IMPORTANT NOTE***

PLEASE MAKE SURE THAT THE SKU_ID IN ALL THREE TABLES ARE IN THE SAME 
FORMAT (LOWER CASE). PLEASE FOLLOW ALL THE ABOVE STEPS TO ACHIVE THAT

==============================================================================

`