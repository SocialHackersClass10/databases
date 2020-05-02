
# About this app

This is the Implementation of  Databases - week 2 - exercises 1 & 2.

All the requirements are implemented through code, with entry point being app.js.



## Prerequisites: MySQL server connection params definition file

The application requires the connection parameters for MySQL Community Server to be specified.

Since this is a common file throughout all exercises, it was moved one folder up, into the parent folder of the application folder.
Effectively it is a sibling folder to the application folders of week's exercises.

The application is looking for it at the following relative path:
```
    ../resources/mysql-params.json
```


Following is an example of this file's content:
```
    {
        "host"      : "<INSERT_YOUR_MYSQL_HOST_ADDRESS_OR_IP_HERE>" ,
        "port"      : <INSERT_YOUR_MYSQL_PORT_NUMBER_HERE> ,
        "user"      : "<INSERT_YOUR_MYSQL_USER_NAME_HERE>" ,
        "password"  : "<INSERT_YOUR_MYSQL_USER_PASSWORD_HERE>"
    }
```

Minimum required definitions are for "user" and "password".

If at run-time any of the minimum requirements, or the file altogther, are missing, the app will log a respective message and terminate.

All other missing MySQL connection parameters will assume default values.



## Output

The application iterates through the requirements in steps as follows:

#### 0.  The Database
*   Delete "company2" database (if exists)
*   Create "company2" database
*   Activate "company2" database


#### 1.  Exercise 1: Employee
*   1. Create "employee" table
*   2. Populate "employee" table: add 20 rows of random synthesised data
*   3. Change "employee" table: add "manager" column & foreign key
*   4. (Bonus) Update "employee" table: any one of the top 5 payed employee will be assigned at random as manager for the rest employee


#### 2.  Exercise 2: Department
*   1. Create "department" table
*   2. Create "department_staff" table implementing department to employee, many-to-many relationship
*   3. (Bonus) Populate "department" table: add 5 rows of random synthesised data
*   4. (Bonus) Populate "department_staff" table: add employee-defined department managers
*   5. (Bonus) Populate "department_staff" table: add employee-defined department personnel


#### 3.  Exercise 2: Database Dump
*   the database is dumped into an external SQL file, located in the same folder as the connection parameters definition file. The filename is:
```
    ../resources/dump-company2.sql
```

