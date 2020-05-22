
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
        {   title   : `1 - Activate "${databaseName}" database`,
            command : `use ${databaseName}`,
            onErrorAbort : true,
        },
        {   title   : '2 - drop "employee_skills" table if already exists',
            command : `drop table if exists employee_skills`,
            onErrorAbort : true,
        },
        {   title   : '3 - drop "skills" table if already exists',
            command : `drop table if exists skills`,
            onErrorAbort : true,
        },
        {   title   : '4 - Create "skills" table: comprises a listing of all known skills',
            command : `create table skills ( `
                     +`skill_id        int(11)         not null    auto_increment, `
                     +`title           varchar(50)     not null    default '', `
                     +`primary key (skill_id) ) `,
            onErrorAbort : true,
        },
        {   title   : '5 - Populate "skills" table: add 13 general skills',
            command : `insert into skills (title) values `
                     +`('Active Listening'),   ('Adaptability'),       ('Communication'), `
                     +`('Creativity'),         ('Critical Thinking'),  ('Customer Service'), `
                     +`('Decision Making'),    ('Management'),         ('Leadership'), `
                     +`('Organization'),       ('Public Speaking'),    ('Problem-solving'), `
                     +`('Teamwork') `,
            onErrorAbort : true,
        },
        {   title   : '6 - Create "employee_skills" table: comprises relation between employee and skills',
            command : `create table employee_skills ( `
                     +`id              int(11)         not null    auto_increment, `
                     +`emp_no          int(11)         not null    default 0, `
                     +`skill_id        int(11)         not null    default 0, `
                     +`primary key (id), `
                     +`key (emp_no,skill_id), `
                     +`foreign key (emp_no) references employee (employee_no), `
                     +`foreign key (skill_id) references skills (skill_id) ) `,
            onErrorAbort : true,
        },
        {   title   : '7 - Populate "employee_skills" table: link each employee with upto 3 random skills',
            command : `insert into employee_skills (emp_no,skill_id) `
                     +`select employee_no , `
                     +`(select skill_id from skills order by rand() limit 1) skill_id `
                     +`from employee union select employee_no , `
                     +`(select skill_id from skills order by rand() limit 1) skill_id `
                     +`from employee union select employee_no , `
                     +`(select skill_id from skills order by rand() limit 1) skill_id `
                     +`from employee `,
            onErrorAbort : true,
        },
        {   title   : '8 (Bonus) - Verify employee skills through a joined listing',
            command : `select e.full_name as "Employee", s.title as "Skill" from employee e `
                     +`left join employee_skills es on (es.emp_no=e.employee_no) `
                     +`left join skills s on (s.skill_id=es.skill_id) `
                     +`order by e.full_name , s.title`,
            renderResult : renderData,
        },
    ];
    const maxScreenWidth=84;        //  72; 84; 96;


    async function executeSQLsequence(rdbms) {
        if (!rdbms) {return false};
        try {
            for (let i=0; i<sqlActionList.length; i++) {
                const {title,command,renderResult,onErrorAbort}=sqlActionList[i];
                try {
                    logActionBegin(title);
                    sqlActionList[i].dataset=await rdbms.execSQL(command);
                    if (renderResult) {sqlActionList[i].renderResult()}
                    else {logActionEnd('Completed')};
                } catch(anError) {
                    const errormsg=anError.sqlMessage?anError.sqlMessage
                         :'Verify MySQL server status and connection parameters';
                    console.log('\nMySQL server Error\ncode    :',anError.code);
                    console.log('message :',errormsg);
                    logActionEnd();
                    if (onErrorAbort) {return false};
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

