
## About this app

This is the Implementation of  Databases - week 1 - exercise 1.

All the requirements are implemented through code, with entry point being app.js.



### Prerequisites: mysql connection parameters definition file

The app requires the mysql connection parameters to be specified in the file:
```
    ./resources/mysql-params.json.
```

Following is an example of the file content:
```
{
    "host"      : "<INSERT_YOUR_MYSQL_HOST_ADDRESS_OR_IP_HERE>" ,
    "port"      : <INSERT_YOUR_MYSQL_PORT_NUMBER_HERE> ,
    .
    .
    .
    "user"      : "<INSERT_YOUR_MYSQL_USER_NAME_HERE>" ,
    "password"  : "<INSERT_YOUR_MYSQL_USER_PASSWORD_HERE>"
}

```

Minimum required are "user" and "password".

If any of those minimum requirements, or the file altogther, are missing at run-time, the app will log a specific message and terminate.

All other missing connection parameters will assume default values.



### Output

The application iterates through the exercise requirements in steps as follows:

##### 1.  The Database
*   Delete "company" database (if exists)
*   Create "company" database
*   Activate "company" database

##### 2.  Employees
*   Create "employees" table

##### 3.  Departments
*   Create "departments" table
*   Create  "department_staff" table

##### 4.  Projects
*   Create "projects" table
*   Create "department_projects" table

##### 5.  Populate tables with data (mostly random generated)
*   Table "employees" - Insert 30 rows of random data: randomly synthesized names and salary
*   Table "departments" - Insert 10 rows of random data: randomly synthesized names
*   Table "department_staff" - Insert 10 Dept. Managers, those from "employees" with the top 10 highest salary will become Head of Departments
*   Table "department_staff" - Insert 20 Dept. personnel, those from "employees" NOT already placed as Heads of Dept. will become Department personnel
*   Table "projects" - Insert 10 rows of random data: randomly synthesized names and dates
*   Table "department_projects" - Insert rabdom data: pair randomly departments with projects (many to many relationship)

##### 6.  SQL error handling & recovery
*   Demonstrate an intentionaly triggered sql-statement error, catching it and communicating it to the user and resuming the application execution

##### 7.  Retrieving and Rendering data
*   List all database table names
*   List all departments and the staff they consist of (managers and personnel)
*   List all departments, for each list all the assigned project and their start & end dates: some departments may have no projects assigned - also projects are possibly assigned to multiple de[artments
*   List all departments that have active projects assigned, along with those project details
*   List all projects, for each list all the assigned departments

