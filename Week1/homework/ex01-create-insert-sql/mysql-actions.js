
{
    'use strict';

    exports.executeSQLsequence = executeSQLsequence;


    //  import random data creation functions
    //
    const rngInt =require('./random-data').getRandomInteger;
    const rngName=require('./random-data').getRandomName;
    const rngDept=require('./random-data').getRandomDept;
    const rngTask=require('./random-data').getRandomTask;
    const rngDate=require('./random-data').getRandomDate;
    const isUndefinedNullEmpty=require('./random-data').isUndefinedNullEmpty;

    //  define frequently used date functions
    //
    const formatDate=(dtObj)=>dtObj.toISOString().substr(0,10);
    const datePassed=(dtObj)=>dtObj<new Date();


    //  the action list holds all mysql actions to be performed in sequence
    //
    //  properties & descriptions:
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
        {   title   : '1.1 - Delete "company" database',
            command : `drop database if exists company`,
            onErrorAbort : true,
        },
        {   title   : '1.2 - Create "company" database',
            command : `create database company`,
            onErrorAbort : true,
        },
        {   title   : '1.3 - Activate "company" database',
            command : `use company`,
            onErrorAbort : true,
        },
        {   title   : '2.1 - Create "employees" table',
            command : `create table employees (`
                     +`    emp_no          int(11)         not null    auto_increment,`
                     +`    emp_name        char(50)        not null    default '',`
                     +`    salary          float(10,2)     not null    default 0.00,`
                     +`    primary key (emp_no) )`,
            onErrorAbort : true,
        },
        {   title   : '3.1 - Create "departments" table',
            command : `create table departments (`
                     +`    dept_no         int(11)         not null    auto_increment,`
                     +`    dept_name       char(70)        not null    default '',`
                     +`    primary key (dept_no) )`,
            onErrorAbort : true,
        },
        {   title   : '3.2 - Create "department_staff" table (relate dpt. to emp.)',
            command : `create table department_staff (`
                     +`    id              int(11)         not null    auto_increment,`
                     +`    dept_no         int(11)         not null    default 0,`
                     +`    emp_no          int(11)         not null    default 0,`
                     +`    head_of_dept    boolean         not null    default false,`
                     +`    primary key (id),`
                     +`    key (dept_no,emp_no),`
                     +`    key (dept_no,head_of_dept),`    // only 1 leader per dept
                     +`    foreign key (dept_no) references departments (dept_no),`
                     +`    foreign key (emp_no) references employees (emp_no) )`,
            onErrorAbort : true,
        },
        {   title   : '4.1 - Create "projects" table',
            command : `create table projects (`
                     +`    proj_no         int(11)         not null    auto_increment,`
                     +`    proj_name       char(90)        not null    default '',`
                     +`    starting_date   date            not null    default '1900-01-01',`
                     +`    ending_date     date            not null    default '1900-01-01',`
                     +`    primary key (proj_no) )`,
            onErrorAbort : true,
        },
        {   title   : '4.2 - Create "department_projects" table (relate dpt. to prj.)',
            command : `create table department_projects (`
                     +`    id              int(11)         not null    auto_increment,`
                     +`    dept_no         int(11)         not null    default 0,`
                     +`    proj_no         int(11)         not null    default 0,`
                     +`    primary key (id),`
                     +`    key (dept_no,proj_no),`
                     +`    foreign key (dept_no) references departments (dept_no),`
                     +`    foreign key (proj_no) references projects (proj_no) )`,
            onErrorAbort : true,
        },
        {   title   : '5.1 - Populate "employees" table: Insert 30 rows of random data',
            command : (function(){
                            let result='insert into employees (emp_name,salary) values ';
                            for (let i=0; i<30; i++) {
                                result+=(i==0?'':',')+`('${rngName()}',${
                                                    rngInt(54321,987654)/100})`;
                            };
                            return result;
                        }()),
            onErrorAbort : true,
        },
        {   title   : '5.2 - Populate "departments" table: Insert 10 rows random data',
            command : (function(){
                            let result='insert into departments (dept_name) values ';
                            for (let i=0; i<10; i++) {
                                result+=(i==0?'':',')+`('${rngDept()}')`;
                            };
                            return result;
                        }()),
            onErrorAbort : true,
        },
        {   title   : '5.3 - Populate "department_staff" table: Insert 10 Managers',
            command : `insert into department_staff (dept_no,emp_no,head_of_dept) `
                     +`select tmp_dept.dept_no , tmp_emp.emp_no , true from`
                     +`    (   select @empl_row_id := @empl_row_id + 1 as "empl_row_id" , e.emp_no`
                     +`        from employees e , (select @empl_row_id := 0) r1`
                     +`        order by e.salary desc,emp_no limit 10`
                     +`    )   tmp_emp ,`
                     +`    (   select @dept_row_id := @dept_row_id + 1 as "dept_row_id" , d.dept_no`
                     +`        from departments d , (select @dept_row_id := 0) r2`
                     +`    )   tmp_dept `
                     +`where empl_row_id = dept_row_id`,
            onErrorAbort : true,
        },
        {   title   : '5.4 - Populate "department_staff" table: Insert 20 personnel',
            command : `insert into department_staff (dept_no,emp_no,head_of_dept) `
                     +`select tmp_dept.dept_no , tmp_emp.emp_no , false from`
                     +`    (   select @empl_row_id := @empl_row_id + 1 as "empl_row_id" , e.emp_no`
                     +`        from employees e , (select @empl_row_id := 0) r1`
                     +`        order by e.salary asc,emp_no limit 20`
                     +`    )   tmp_emp ,`
                     +`    (   select @dept_row_id := @dept_row_id + 1 as "dept_row_id" , d.dept_no`
                     +`        from departments d , (select @dept_row_id := 0) r2`
                     +`    )   tmp_dept `
                     +`where empl_row_id in ( dept_row_id , dept_row_id + 10 )`,
            onErrorAbort : true,
        },
        {   title   : '5.5 - Populate "projects" table: Insert 10 rows of random data',
            command : (function(){
                            let result=  'insert into projects '
                                        +'(proj_name,starting_date,ending_date) values';
                            for (let i=0; i<10; i++) {
                                const dt1=rngDate('2009.01.01','2019.12.31');
                                const dt2=rngDate(dt1,'2025.12.31');
                                result+=(i==0?'':',')+`('${rngTask()}','${
                                                    dt1.toISOString().substr(0,10)}','${
                                                    dt2.toISOString().substr(0,10)}')`;
                            };
                            return result;
                        }()),
            onErrorAbort : true,
        },
        {   title   : '5.6 - Populate "department_projects" table: Insert random data',
            command : `insert into department_projects (dept_no,proj_no) `
                     +`select dept_no , proj_no from ( select`
                     +`    floor(rand()*10)-4 as rng1 ,`
                     +`    floor(rand()*10)+6 as rng2 ,`
                     +`    floor(rand()*10)-4 as rng3 ,`
                     +`    floor(rand()*10)+6 as rng4 ,`
                     +`    proj_no , dept_no`
                     +`    from projects , departments ) tmp `
                     +`where proj_no in (rng1,rng2,rng3,rng4)`,
            onErrorAbort : true,
        },
        {   title   : '6.1 - '+insertLineBreaks('Demonstrate sql error handling & resume'
                        +' execution:  The next sql statement intentionally raises an'
                        +' exception, which is caught, communicated to the user and the'
                        +' application resumes execution.',53,' '.repeat(13)),
            command : `select ; `,
            onErrorAbort : false,
        },
        {   title   : '7.1 - Render list of tables in "company" database',
            command : `show tables`,
            renderResult : (dataSet)=>{
                            if (dataSet.length<1) {return false};
                            const pds=' '.repeat(10);
                            console.log(' ');
                            dataSet.forEach(lmnt=>console.log(pds+lmnt.Tables_in_company));
                        },
            onErrorAbort : false,
        },
        {   title   : '7.2 - Render Departments & assigned managers and employees',
            command : `select d.dept_name , e.emp_name , s.head_of_dept `
                     +`from employees e `
                     +`left join department_staff s on (s.emp_no = e.emp_no) `
                     +`left join departments d on (d.dept_no = s.dept_no) `
                     +`order by d.dept_name , e.salary desc , s.emp_no`,
            renderResult : (dataSet)=>{
                            const isHoDorEmpl=(flg)=>flg==1?'Head of Dpt.':'Personnel';
                            if (dataSet.length<1) {return false};
                            const pds=' '.repeat(10);
                            let lastDpt='';
                            dataSet.forEach(lmnt=>{
                                if (lmnt.dept_name!==lastDpt) {
                                    lastDpt=lmnt.dept_name;
                                    console.log(' ');
                                    console.log('  ',lastDpt);
                                };
                                console.log(pds +isHoDorEmpl(lmnt.head_of_dept).padEnd(15,' ')
                                                +lmnt.emp_name);
                            });
                        },
            onErrorAbort : false,
        },
        {   title   : '7.3 - Render all departments and their assigned project data',
            command : `select dpt.dept_name , prj.proj_name , prj.starting_date , prj.ending_date`
                     +` from departments dpt `
                     +`left join department_projects rdp on (rdp.dept_no=dpt.dept_no) `
                     +`left join projects prj on (prj.proj_no=rdp.proj_no) `
                     +`order by dpt.dept_name , prj.starting_date , prj.ending_date`,
            renderResult : (dataSet)=>{
                            if (dataSet.length<1) {return false};
                            const pds=' '.repeat(10);
                            let lastDpt='', lastPrj=undefined;
                            dataSet.forEach(lmnt=>{
                                if (lmnt.dept_name!==lastDpt) {
                                    if (!isUndefinedNullEmpty(lastPrj,false)) {console.log(' ')};
                                    lastDpt=lmnt.dept_name;
                                    console.log(' ');
                                    console.log('  ',lastDpt);
                                    lastPrj='';
                                };
                                if (isUndefinedNullEmpty(lmnt.proj_name,false)) {
                                    console.log(' ');
                                    console.log(pds+'*** This Department has no projects');
                                    console.log(' ');
                                    lastPrj=undefined;
                                } else {
                                    if (lmnt.proj_name!==lastPrj) {
                                        lastPrj=lmnt.proj_name;
                                        console.log(' ');
                                        console.log(pds+insertLineBreaks(lastPrj,60,pds));
                                    };
                                    console.log( pds+'Started on '
                                                +formatDate(lmnt.starting_date)
                                                +pds+`Expire${
                                                    datePassed(lmnt.ending_date)?'d':'s'} on `
                                                +formatDate(lmnt.ending_date));
                                };
                            });
                        },
            onErrorAbort : false,
        },
        {   title   : '7.4 - Render departments with active projects assigned',
            command : `select dpt.dept_name , prj.proj_name , prj.starting_date , prj.ending_date`
                     +` from departments dpt `
                     +`join department_projects rdp on (rdp.dept_no=dpt.dept_no) `
                     +`join projects prj on (prj.proj_no=rdp.proj_no) `
                     +`where prj.ending_date>=current_date() `
                     +`order by dpt.dept_name , prj.starting_date , prj.ending_date`,
            renderResult : (dataSet)=>{
                            if (dataSet.length<1) {return false};
                            const pds=' '.repeat(10);
                            let lastDpt='', lastPrj=undefined;
                            dataSet.forEach(lmnt=>{
                                if (lmnt.dept_name!==lastDpt) {
                                    if (!isUndefinedNullEmpty(lastPrj,false)) {console.log(' ')};
                                    lastDpt=lmnt.dept_name;
                                    console.log(' ');
                                    console.log('  ',lastDpt);
                                    lastPrj='';
                                };
                                if (lmnt.proj_name!==lastPrj) {
                                    lastPrj=lmnt.proj_name;
                                    console.log(' ');
                                    console.log(pds+insertLineBreaks(lastPrj,60,pds));
                                };
                                console.log( pds+'Started on '+formatDate(lmnt.starting_date)
                                            +pds+'Expires on '+formatDate(lmnt.ending_date));
                            });
                        },
            onErrorAbort : false,
        },
        {   title   : '7.5 - Render all projects and all their assigned departments',
            command : `select prj.proj_name , prj.starting_date , prj.ending_date , dpt.dept_name`
                     +` from projects prj `
                     +`left join department_projects rdp on (rdp.proj_no=prj.proj_no) `
                     +`left join departments dpt on (dpt.dept_no=rdp.dept_no) `
                     +`order by prj.starting_date , prj.ending_date , dpt.dept_name`,
            renderResult : (dataSet)=>{
                            if (dataSet.length<1) {return false};
                            const pds=' '.repeat(10);
                            let lastPrj='', lastDpt=undefined;
                            dataSet.forEach(lmnt=>{
                                if (lmnt.proj_name!==lastPrj) {
                                    if (!isUndefinedNullEmpty(lastDpt,false)) {console.log(' ')};
                                    lastPrj=lmnt.proj_name;
                                    console.log(' ');
                                    console.log('  ',lastPrj);
                                    lastDpt='';
                                    console.log( '  ','Started on '
                                                +formatDate(lmnt.starting_date)
                                                +pds+`Expire${
                                                    datePassed(lmnt.ending_date)?'d':'s'} on `
                                                +formatDate(lmnt.ending_date));
                                };
                                if (isUndefinedNullEmpty(lmnt.dept_name,false)) {
                                    console.log(' ');
                                    console.log(pds+'*** This Project has no assigned Departments');
                                    console.log(' ');
                                    lastDpt=undefined;
                                } else {
                                    if (lmnt.dept_name!==lastDpt) {
                                        lastDpt=lmnt.dept_name;
                                        console.log(' ');
                                        console.log(pds+lastDpt);
                                    };
                                };
                            });
                        },
            onErrorAbort : false,
        },
    ];


    function executeSQLsequence(conxParams) {
        const rdbms = require('mysql').createConnection(conxParams);
        let sqlActionIndex = -1;
        queryCallback();

        function queryCallback(anError,aResultSet,aFieldSet) {
            //      //  handle any errors from last sqlAction
            if (anError) {
                const argTxt='Verify mysql server status and connection params';
                const errFlg=(sqlActionIndex<0)
                           ||(sqlActionList[sqlActionIndex].onErrorAbort);
                const errTxt='\n    code   : '+anError.code+'\n    message: '
                            +insertLineBreaks(anError.sqlMessage
                                                ?anError.sqlMessage:argTxt
                                                ,42,' '.repeat(13))
                            +(errFlg?'\nSequence interrupted, finalizing...':'');
                logSQLmsg('Error',errTxt);
                if (errFlg) {closeConnection(); return false};
            };
            //      //  handle the result from last sqlAction
            if (aResultSet) {
                const flg=(sqlActionIndex>=0)
                        &&(sqlActionList[sqlActionIndex].renderResult);
                if (flg) {sqlActionList[sqlActionIndex].renderResult(aResultSet)}
                else {logSQLmsg('Success')};
            };
            //      //  check for established connection  /  connect if missing
            if (!rdbmsConnected()) {
                logSQLmsg('Attempt','Initialize mysql connection');
                rdbms.connect(queryCallback);
                return true;
            };
            //      //  prepare for next sqlAction  /  finalize if end reached
            sqlActionIndex++;
            if (sqlActionIndex>=sqlActionList.length) {
                closeConnection();
                return true;
            };
            //      //  issue next sqlAction with self as callback
            logSQLmsg('Attempt',sqlActionList[sqlActionIndex].title);
            rdbms.query(sqlActionList[sqlActionIndex].command,queryCallback);
            return true;
        };

        function closeConnection() {
            if (rdbmsConnected()) {
                logSQLmsg('Attempt','end connection');
                rdbms.end();
                logSQLmsg('Success');
            };
        };

        function rdbmsConnected() {
            return (rdbms.state !== 'disconnected');
        };

        function logSQLmsg(msgReason='',msgSubject='') {
            const lineAfter=(msgReason==='Success')||(msgReason==='Error');
            if (msgReason==='Attempt') {console.log('_'.repeat(70),'\n')};
            console.log(` ${msgReason==='Attempt'?'Step':msgReason}${
                            msgSubject.trim()===''?'':': '}${msgSubject}`);
            if (lineAfter) {console.log('_'.repeat(70),'\n')};
        };
    };


    function insertLineBreaks(aText,maxLen=70,prefix='') {
        let lastBreak=0;
        return aText.split(' ').reduce((t,c)=>{
            let result=t+' '+c;
            if ((result.length-lastBreak)>maxLen) {
                result=t+'\n'+prefix;
                lastBreak=result.length;
                result+=c;
            };
            return result.trim();
        },'');
    };

};


;

