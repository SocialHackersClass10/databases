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

//Employees
const employeeList = [
    {emp_name: "Lev Tolstoy", salary: 1000, reports_to: "Charles Dickens"},
    {emp_name: "Jane Austen", salary: 1500, reports_to: "George Orwell"},
    {emp_name: "Ernest Hemingway", salary: 1750, reports_to: "Mark Twain"},
    {emp_name: "Gabriel Marcia Marquez", salary: 2000, reports_to: "Gustave Flaubert"},
    {emp_name: "Paulo Coelho", salary: 2040, reports_to: "Jules Verne"},
    {emp_name: "John Steinbeck", salary: 2220, reports_to: "William Shakespeare"},
    {emp_name: "J.R.R. Tolkien", salary: 2500, reports_to: "Orhan Pamuk"},
    {emp_name: "Edgar Allan Poe", salary: 2000, reports_to: "Stefan Zweig"},
    {emp_name: "Virginia Woolf", salary: 2000, reports_to: "James Joyce"},
    {emp_name: "Odysseas Elytis", salary: 2000, reports_to: "Petros Markaris"}];

//adds employee to employees table
for (const employee of employeeList){
        connection.query(`insert into employees (emp_name, salary, reports_to) 
        values('${employee.emp_name}','${employee.salary}','${employee.reports_to}');`, err => {
            if(err){
                console.error(`Error: ${err.message}`);
                connection.end();
            }
            console.log(`${employee.emp_name} is added to database`)
        })
}


//departments
const departmentList = [
    {dept_name:"Production", manager: "Petros Markaris" },
    {dept_name:"Research and Development", manager: "James Joyce" },
    {dept_name:"Purchasing", manager: "Stefan Zweig" },
    {dept_name:"Marketing", manager: "Orhan Pamuk" },
    {dept_name:"Human Resource Management", manager: "William Shakespeare" },
    {dept_name:"Accounting and Finance", manager: "Mark Twain" },
    {dept_name:"Security", manager: "Gabriel Marcia Marquez" },
    {dept_name:"Communication", manager: "Odysseas Elytis" },
    {dept_name:"Customer Service Support", manager: "Lev Tolstoy" },
    {dept_name:"Legal Department", manager: "Virginia Woolf" }];

//adds department to departments table
for (const department of departmentList){
    connection.query(`insert into departments (dept_name, manager) 
        values('${department.dept_name}','${department.manager}');`, err => {
        if(err){
            console.error(`Error: ${err.message}`);
            connection.end();
        }
        console.log(`${department.dept_name} is added to database`)
    })
}

//projects
const projectList = [
    {proj_name:"Word Game", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"Library Application", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"E-Commerce Web Application", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"Open Source Vue Project", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"Alternative Free IDE", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"Recipe MVC Application", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"Messenger App", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"New JavaScript Framework", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"New JavaScript Library", starting_date:"2008-05-17", ending_date:"2008-07-17"},
    {proj_name:"NodeJs Application", starting_date:"2008-05-17", ending_date:"2008-07-17"}];

//adds project to projects table
for (const project of projectList){
    connection.query(`insert into projects (proj_name, starting_date, ending_date) 
        values('${project.proj_name}','${project.starting_date}','${project.ending_date}');`, err => {
        if(err){
            console.error(`Error: ${err.message}`);
            connection.end();
        }
        console.log(`${project.proj_name} is added to database`)
    })
}
