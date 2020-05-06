
# About this app

This is the Implementation of  Databases - week 3 - exercises 2

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

The application first initializes by retrieving and applying the database server connection parameters, connecting to the server and activating the "company2" database. Then it renders the current company department structure, showing all departments with managers & personnel. Finally it requests from the user to input the 2 desired target ID's (department_no & employee_no) used as arguments for the flatify function.

Once all those initialization steps are completed, the flatify function is evoked with parameters the dbconnection along with the user-specified dpartment and employee ID's. When the function finishes, the app logs the result and terminates.


###The Flatify function goes through following steps:

*   acquire actual TARGET_DEPT_NO by selecting from department the ESCAPED value of PARAM_DEPT_NO. If not found -> report the error and return false

*   acquire actual TARGET_EMP_NO by selecting from employee the ESCAPED value of PARAM_EMP_NO. If not found -> report the error and return false

*   check if TARGET_EMP_NO is already manager of TARGET_DEPT_NO. If yes -> report it and return false

*   render a message stating that
```
        employee EMP_NAME with emp_no= TARGET_EMP_NO will be assigned as
        the manager of department DEPT_TITLE with dept_no= TARGET_DEPT_NO
```

*   start transaction

*   if TARGET_EMP_NO is not already a manager -> remove TARGET_EMP_NO from all departments.

*   mark TARGET_EMP_NO as a manager

*   assign TARGET_EMP_NO to TARGET_DEPT_NO

*   mark all others belonging to TARGET_DEPT_NO as having manager TARGET_EMP_NO

*   on any error -> report the error, and if in transaction -> rollback.

*   finally commit changes and render new company structure -> show all departments with managers & personnel

*   return whether or not the flatify attempt was successful

