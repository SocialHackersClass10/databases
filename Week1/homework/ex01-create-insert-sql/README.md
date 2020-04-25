
# About this app

This is the Implementation of  Databases - week 1 - exercise 1.

All the requirements are implemented through code, with entry point being app.js.



## Prerequisites: MySQL server connection params definition file

The application requires the connection parameters for MySQL Community Server to be specified in the file:
```
    ./resources/mysql-params.json.
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

The application iterates through the exercise requirements in steps as follows:

#### 1.  The Database
*   Delete "company" database (if exists)
*   Create "company" database
*   Activate "company" database

#### 2.  Employees
*   Create "employees" table

#### 3.  Departments
*   Create "departments" table
*   Create  "department_staff" table

#### 4.  Projects
*   Create "projects" table
*   Create "department_projects" table

#### 5.  Populate tables with data (mostly random generated)
*   Table "employees" - Insert 30 rows of random data: Randomly synthesized names and salary values
*   Table "departments" - Insert 10 rows of random data: Randomly synthesized names
*   Table "department_staff" - Insert 10 Dept. Managers: Those "employees" with the top 10 highest salary values will become Head of Departments
*   Table "department_staff" - Insert 20 Dept. personnel: Those "employees" NOT already placed as Heads of Dept. will become Department personnel
*   Table "projects" - Insert 10 rows of random data: Randomly synthesized names and dates
*   Table "department_projects" - Insert rabdom data: Randomly pair departments with projects (many to many relationship)

#### 6.  SQL error handling & recovery
*   Demonstrate an intentionaly triggered sql-statement error, catching it and communicating it to the user and resuming the application execution

#### 7.  Retrieving and Rendering data
*   List all database table names
*   List all departments and the staff they consist of (managers and personnel)
*   List all departments, for each department also list all assigned project and their start & end dates: Some departments may have no projects assigned - also projects are possibly assigned to multiple departments
*   List all departments that have active projects assigned, along with those project details
*   List all projects, for each project also list all assigned departments

