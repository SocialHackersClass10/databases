
{
    'use strict';

    exports.executeSQL = executeSQLsequence;


    const databaseName='company2';


    //  the action list holds all mysql actions to be performed in sequence
    //
    //            {   title   : 'x - xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    //                command : `xxxxxxxxxxxxxxxxxxxxxxx `
    //                         +`xxxxxxxxxxxxxxxxxxxxxxx `
    //                         +`xxxxxxxxxxxxxxxxxxxxxxx `
    //                         +`xxxxxxxxxxxxxxxxxxxxxxx `,
    //                renderResult : renderData,
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
        {   title   : `0.1 - Activate "${databaseName}" database`,
            command : `use ${databaseName}`,
            onErrorAbort : true,
        },
        {   title   : 'Joins 1 - List all employees, list their Role and also their Manager',
            command : `select e.full_name as "Employee Name" , case when e.manager is null `
                     +`then "Manager" else "Personnel" end as "Role" , `
                     +`case when e.manager is null then "" else m.full_name end as "Manager Name" `
                     +`from employee e left join employee m on (m.employee_no=e.manager) `
                     +`order by e.full_name `,
            renderResult : renderData,
        },
        {   title   : 'Joins 2 - List all departments, include assigned employees and their roles',
            command : `select d.title as "Department Title", `
                     +`case when e.full_name is null then "- No assigned personnel" `
                     +`else e.full_name end as "Employee Name" , `
                     +`case when e.full_name is null then "-" `
                     +`else case when e.manager is null then "Manager" `
                     +`else "Personnel" end end as "Role" from department d `
                     +`left join department_staff s on (s.dept_no=d.dept_no) `
                     +`left join employee e on (e.employee_no=s.emp_no) `
                     +`order by d.title,e.manager,e.full_name `,
            renderResult : renderData,
        },
        {   title   : 'Aggregates 1 - Calculate the number of departments and of employees',
            command : `select * from `
                     +`(select count(*) as "Number of Departments" from department) d , `
                     +`(select count(*) as "Number of Employees" from employee) e `,
            renderResult : renderData,
        },
        {   title   : 'Aggregates 2 - Calculate the Sum of the salaries of all employees',
            command : `select sum(salary) as "Total company salary" from employee `,
            renderResult : renderData,
        },
        {   title   : 'Aggregates 3 - Calculate the Average of the salaries of all employees',
            command : `select avg(salary) as "Company average salary" from employee `,
            renderResult : renderData,
        },
        {   title   : 'Aggregates 4 - Calculate Sum of salaries of employees per department',
            command : `select d.title as "Department Title" , `
                     +`count(e.employee_no) as "Personnel" , `
                     +`case when sum(e.salary) is null then 0 else sum(e.salary) `
                     +`end as "Total salary" from department d `
                     +`left join department_staff s on (s.dept_no=d.dept_no) `
                     +`left join employee e on (e.employee_no=s.emp_no) `
                     +`group by d.title order by d.title `,
            renderResult : renderData,
        },
        {   title   : 'Aggregates 5 - Calculate minimum and maximum salaries per department',
            command : `select d.title as "Department Title" , `
                     +`case when min(e.salary) is null then 0 else min(e.salary) `
                     +`end as "Min. salary" , `
                     +`case when max(e.salary) is null then 0 else max(e.salary) `
                     +`end as "Max. salary" from department d `
                     +`left join department_staff s on (s.dept_no=d.dept_no) `
                     +`left join employee e on (e.employee_no=s.emp_no) `
                     +`group by d.title order by d.title `,
            renderResult : renderData,
        },
        {   title   : 'Aggregates 6 - For each salary value, return number of employees paid',
            command : `select salary as "Salary Value" , `
                     +`count(employee_no) as "Count Employees paid that much" `
                     +`from employee group by salary `,
            renderResult : renderData,
        },
    ];
    const maxScreenWidth=84;        //  72; 84; 96;


    async function executeSQLsequence(rdbms) {
        if (!rdbms) {return false};
        try {
            for (let i=0; i<sqlActionList.length; i++) {
                try {
                    logActionBegin(sqlActionList[i].title);
                    sqlActionList[i].dataset=await rdbms.execSQL(sqlActionList[i].command);
                    if (sqlActionList[i].renderResult) {sqlActionList[i].renderResult()}
                    else {logActionEnd('Completed')};
                } catch(anError) {
                    const errormsg=anError.sqlMessage?anError.sqlMessage
                                  :'Verify MySQL server status and connection parameters';
                    console.log('\nMySQL server Error\ncode    :',anError.code);
                    console.log('message :',errormsg);
                    logActionEnd();
                    if (sqlActionList[i].onErrorAbort) {return false};
                };
            };
        } finally {
            logActionBegin('Disconnecting');
            await rdbms.disconnect();
            logActionEnd('Terminating');
        };
    };


    function renderData() {
        if ((!this.dataset)||(this.dataset.length<1)) {return false};
        const numericDatatype=typeof(1);
        privateRenderData(this.dataset,getDataProperties(this.dataset));

        function privateRenderData(aDataset,dataProps) {
            const pds=' '.repeat(3), rowmsg=`${pds} Total ${aDataset.length} rows`;
            let dividerstr='';
            aDataset.forEach((datarow,rowindex)=>{
                let rowstr=pds;
                if (rowindex===0) {
                    for (let fldkey in datarow) {
                        dividerstr+=justifyText('-'.repeat(dataProps[fldkey].width)
                                                ,dataProps[fldkey]);
                    };
                    for (let fldkey in datarow) {
                        rowstr+=justifyText(fldkey,dataProps[fldkey]);
                    };
                    rowstr+='\n'+pds+dividerstr+'\n'+pds;
                    console.log(' ');
                };
                for (let fldkey in datarow) {
                    rowstr+=justifyText(datarow[fldkey],dataProps[fldkey]);
                };
                console.log(rowstr);
            });
            console.log(pds+dividerstr);
            if (aDataset.length>1) {console.log(rowmsg)};
        };

        function justifyText(fldValue,fldProps) {
            let result;
            if (fldProps.type===numericDatatype) {
                result=String(fldValue).padStart(fldProps.width,' ');
            } else {
                result=String(fldValue).padEnd(fldProps.width,' ');
            };
            return ' '+result+' ';
        };

        function getDataProperties(aDataset) {
            const result={};
            aDataset.forEach(datarow=>{
                for(let fldkey in datarow) {
                    const fldvalue=datarow[fldkey], fldtype=typeof(fldvalue);
                    const intvalue=(fldtype===numericDatatype)
                                 &&(Number.isInteger(fldvalue));
                    if (isUndefinedNullEmpty(result[fldkey],false)) {
                        result[fldkey]={type:fldtype,isint:intvalue,
                                                        width:fldkey.length};
                    } else if (!intvalue) {result[fldkey].isint=false};
                };
            });
            aDataset.forEach(datarow=>{
                for(let fldkey in datarow) {
                    if (result[fldkey].type===numericDatatype) {
                        datarow[fldkey]=datarow[fldkey].toLocaleString(undefined,
                          { minimumFractionDigits:(result[fldkey].isint?0:2),
                            maximumFractionDigits:(result[fldkey].isint?0:2)  });
                    };
                    const width=String(datarow[fldkey]).length;
                    if (result[fldkey].width<width) {result[fldkey].width=width};
                };
            });
            return result;
        };
    };


    function isUndefinedNullEmpty(theValue,chkEmpty=true) {
        const isEmptyString=()=>((chkEmpty)&&(String(theValue).trim()===''));
        return (theValue==undefined)||(theValue==null)||(isEmptyString());
    };


    function logActionBegin(logmsg) {
        console.log('_'.repeat(maxScreenWidth),'\n');
        if (logmsg) {console.log('',logmsg)};
    };

    function logActionEnd(logmsg) {
        if (logmsg) {console.log('',logmsg)};
        console.log('_'.repeat(maxScreenWidth),'\n');
    };

};


;

