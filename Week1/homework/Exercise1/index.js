const mysql = require('mysql');

//Connection details
const connection = mysql.createConnection({
    host:'localhost',
    user:'hyfuser',
    password: 'hyfpassword'

})

//Connects mysql server
connection.connect(err => {
    if (err) throw err;
    console.log("Connected!");
});

//Creates 'company' database
const createDatabaseQuery = 'create database if not exists company';
connection.query(createDatabaseQuery, err => {
    if(err) throw err;
    console.log('Database created!');
});

//Uses 'company' database
const useDatabaseQuery = 'use company';
connection.query(useDatabaseQuery, err=> {
    if (err) throw err;
    console.log('Database selected');
})


//Creates 'employees' table
const createEmployeesTableQuery = `create table if not exists employees
                    (
                      emp_no int not null auto_increment,
                      emp_name varchar(254) not null,
                      salary decimal(10,2) not null,
                      reports_to varchar(254) not null,
                      primary key(emp_no)
                    )`;
connection.query(createEmployeesTableQuery, err=> {
    if(err) throw  err;
    console.log('Table(Employees) created');
})


//Creates 'departments' table
const createDepartmentsTableQuery = `create table if not exists departments
                                (
                                    dept_no int not null auto_increment,
                                    dept_name varchar(254) not null,
                                    manager varchar(254) not null,
                                    primary key(dept_no)
                                )`;
connection.query(createDepartmentsTableQuery, err => {
    if(err) throw err;
    console.log('Table(Departments) created')
})


//Creates 'projects' table
const createProjectsTableQuery = `create table if not exists projects
                                (
                                    proj_no int not null auto_increment,
                                    proj_name varchar(254) not null,
                                    starting_date date not null,
                                    ending_date date not null,
                                    primary key(proj_no)    
                                )`;
connection.query(createProjectsTableQuery, err => {
    if(err) throw err;
    console.log('Table(Projects) created')
})