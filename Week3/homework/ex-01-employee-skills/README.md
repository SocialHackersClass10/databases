
# About this app

This is the Implementation of  Databases - week 3 - exercises 1

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


#### 1.  Activate "company2" database
This database is created by DB homework week 2's exercise 1.


#### 2. & 3.  Drop "employee_skills" and "skills" tables
These implement the solution for adding an arbitrary number of skills to any employee. Here those tables are dropped (if they exist) to be re-created and re-populated in the following steps, thus facilitating a clean slate.


#### 4. & 5.  Create and populate "skills" table
This table will include all known skills needed to be assigned to employees


#### 6. & 7.  Create and populate "employee_skills" table
This table implements the relationship between employees and skills


#### 8. (Bonus) - Verify populated employee skills through a joined listing
Renders the resulting dataset of a select statement between employee join to empoyee_skills join to skills. The rendered listing consists on the Employee name and the Skill title, sorted alphabetically, 1st by Employee name, then by Skill title.

