
{
    'use strict';

    exports.executeSQL = executeSQLsequence;


    //  import random data creation functions
    //
    const rngInt =require('./random-data').getRandomInteger;
    const rngName=require('./random-data').getRandomName;
    const rngAddr=require('./random-data').getRandomAddress;
    const rngDept=require('./random-data').getRandomDept;
    const rngDesc=require('./random-data').getRandomDescr;
    const databaseName='company2';


    //  the action list holds all mysql actions to be performed in sequence
    //
    //            {   title   : 'x - xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    //                command : `xxxxxxxxxxxxxxxxxxxxxxx `
    //                         +`xxxxxxxxxxxxxxxxxxxxxxx `
    //                         +`xxxxxxxxxxxxxxxxxxxxxxx `
    //                         +`xxxxxxxxxxxxxxxxxxxxxxx`,
    //                renderResult : renderQueryResults,
    //                onErrorAbort : false,
    //            },
    //
    //  property list:
    //
    //      title           rendered message when this action is initiated
    //
    //      command         the sql command to be executed,
    //
    //      renderResult    function that, if defined, gets called to render
    //                      the resulting dataset of this sql statement
    //                      used to console.log the selected rows
    //
    //      onErrorAbort    whether an error should interrupt the sqlActionList
    //                      example:    decided to continue if a select failed
    //                                  but to abort on a failed connection
    //
    const sqlActionList=[
        {   title   : `0.1 - Delete "${databaseName}" database`,
            command : `drop database if exists ${databaseName}`,
            onErrorAbort : true,
        },
        {   title   : `0.2 - Create "${databaseName}" database`,
            command : `create database ${databaseName}`,
            onErrorAbort : true,
        },
        {   title   : `0.3 - Activate "${databaseName}" database`,
            command : `use ${databaseName}`,
            onErrorAbort : true,
        },
        {   title   : '1.1 - Create "employee" table',
            command : `create table employee (`
                     +`    employee_no     int(11)         not null    auto_increment,`
                     +`    full_name       varchar(50)     not null    default '',`
                     +`    salary          float(10,2)     not null    default 0.00,`
                     +`    address         varchar(70)     not null    default '',`
                     +`    primary key (employee_no) )`,
            onErrorAbort : true,
        },
        {   title   : '1.2 - Populate "employee" table: Insert 20 rows of random data',
            command : (function(){
                            let result='insert into employee (full_name,address,salary) values ';
                            for (let i=0; i<20; i++) {
                                result+=(i==0?'':',')+`('${rngName()}','${rngAddr()
                                                    }',${rngInt(98765,1234567)/100})`;
                            };
                            return result;
                        }()),
            onErrorAbort : true,
        },
        {   title   : '1.3 - Add "manager" column & foreign key to "employee" table',
            command : `alter table employee  add manager int(11) , `
                     +`add foreign key (manager) references employee (employee_no)`,
            onErrorAbort : true,
        },
        {   title   : '1.4 (BONUS) - Assign Top 5 payed employees as managers',
            command : `update employee set manager=(select manager_id from `
                     +`(   select @mnger_rowid:=@mnger_rowid+1 as "mnger_rowid" , `
                     +`    e.employee_no as "manager_id" , e.full_name `
                     +`    from employee e , (select @mnger_rowid:=0) r2 `
                     +`    order by e.salary desc,employee_no limit 5 `
                     +`)   mnger order by rand() limit 1 ) `
                     +`where employee_no in (select personnel_id from `
                     +`(   select @prsnl_rowid:=@prsnl_rowid+1 as "prsnl_rowid" , `
                     +`    e.employee_no as "personnel_id" , e.full_name `
                     +`    from employee e , (select @prsnl_rowid:=0) r1 `
                     +`    order by e.salary,employee_no limit 15) prsnl) `,
            onErrorAbort : true,
        },
        {   title   : '2.1 - Create "department" table',
            command : `create table department (`
                     +`    dept_no         int(11)         not null    auto_increment,`
                     +`    title           varchar(70)     not null    default '',`
                     +`    description     varchar(70)     not null    default '',`
                     +`    address         varchar(70)     not null    default '',`
                     +`    primary key (dept_no) )`,
            onErrorAbort : true,
        },
        {   title   : '2.2 - Create "department_staff" table (relations between dpt. & empl.)',
            command : `create table department_staff (`
                     +`    id              int(11)         not null    auto_increment,`
                     +`    dept_no         int(11)         not null    default 0,`
                     +`    emp_no          int(11)         not null    default 0,`
                     +`    primary key (id),`
                     +`    key (dept_no,emp_no),`
                     +`    foreign key (dept_no) references department (dept_no),`
                     +`    foreign key (emp_no) references employee (employee_no) )`,
            onErrorAbort : true,
        },
        {   title   : '2.3 (BONUS) - Populate "department" table: Insert 5 rows of random data',
            command : (function(){
                            let result='insert into department (title,description,address) values ';
                            for (let i=0; i<5; i++) {
                                result+=(i==0?'':',')+`('${rngDept()}','${rngDesc()
                                                                    }','${rngAddr()}')`;
                            };
                            return result;
                        }()),
            onErrorAbort : true,
        },
        {   title   : '2.4 (BONUS) - Populate "department_staff" table with managers',
            command : `insert into department_staff (dept_no,emp_no) `
                     +`select tmp_dept.dept_no , tmp_emp.employee_no from `
                     +`(   select @dpt_rowid:=@dpt_rowid+1 as "dpt_rowid" , `
                     +`    d.dept_no , d.title `
                     +`    from department d , (select @dpt_rowid:=0) r1 ) tmp_dept , `
                     +`(   select @emp_rowid:=@emp_rowid+1 as "emp_rowid" , `
                     +`    e.employee_no , e.full_name `
                     +`    from employee e , (select @emp_rowid:=0) r2 `
                     +`    where e.manager is null `
                     +`    order by e.salary desc,employee_no ) tmp_emp `
                     +`where emp_rowid=dpt_rowid`,
            onErrorAbort : false,
        },
        {   title   : '2.5 (BONUS) - Populate "department_staff" table with personnel',
            command : `insert into department_staff (dept_no,emp_no) `
                     +`select d.dept_no,e.employee_no from employee e `
                     +`join department_staff d on (d.emp_no=e.manager)`,
            onErrorAbort : false,
        },
    ];
    const maxScreenWidth=72;      //  84;      //  96;


    async function executeSQLsequence(rdbms,conxArgs) {
        if (!rdbms) {return false};
        const mysqldump=require('mysqldump');
        try {
            for (let i=0; i<sqlActionList.length; i++) {
                try {
                    logActionBegin(sqlActionList[i].title);
                    await rdbms.execSQL(sqlActionList[i].command);
                    logActionEnd('success');
                } catch(anError) {
                    const errormsg=anError.sqlMessage?anError.sqlMessage
                                  :'Verify MySQL server status and connection parameters';
                    console.log('\nMySQL server Error\ncode    :',anError.code);
                    console.log('message :',errormsg);
                    logActionEnd();
                    if (sqlActionList[i].onErrorAbort) {return false};
                };
            };
            const dumpFilename=`../resources/dump-${databaseName}.sql`;
            logActionBegin('creating database dump file:  '+dumpFilename);
            conxArgs.database=databaseName;
            await mysqldump({connection:conxArgs,dumpToFile:dumpFilename});
        } finally {
            await rdbms.disconnect();
            logActionEnd('Terminating');
        };
    };


    function logActionBegin(logmsg) {
        console.log('_'.repeat(maxScreenWidth),'\n');
        if (logmsg) {console.log(logmsg)};
    };

    function logActionEnd(logmsg) {
        if (logmsg) {console.log(logmsg)};
        console.log('_'.repeat(maxScreenWidth),'\n');
    };

};


;

