
# About this app

This is the Implementation of  Databases - week 2 - exercises 3 & 4.

All the requirements are implemented through code, with entry point being app.js.

For reading convenience, all numbers are formatted with thousands separators, respectfully to the current locale.



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
*   Activate "company2" database. This app requires the existance of "company2" database, which is created and populated by the application of the former exercise ( ../ex-01-02..../app.js ).


#### 1.  Exercise 3: Joins
*   1. List all employees, for each list their Role and manager (sorted by employee name)
*   2. List all departments, include any assigned employees and their roles (sorted by dpt. title then by employee role then by employee name - while rendering, data is grouped by dpt.)


#### 2.  Exercise 4: Aggregates
*   1. Calculate the number of departments and the number of employees
*   2. Calculate the Sum of the salaries of all employees
*   3. Calculate the Average of the salaries of all employees
*   4. Calculate the Sum of salaries of employees per department
*   5. Calculate the Minimum and maximum of salaries per department
*   6. For each distinct salary value, return the number of employees paid that much.

