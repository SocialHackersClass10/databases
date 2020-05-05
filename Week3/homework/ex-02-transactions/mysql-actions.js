
{
    'use strict';

    const databaseName='company2';


    exports.databaseName=databaseName;
    exports.departmentSelect=departmentSelect;
    exports.renderData=renderData;
    exports.flatify=flatify;


    function departmentSelect(dept_no) {
        return 'select d.dept_no as "dept_no", d.title as "Department", '
              +'e.employee_no as "emp_no" , '
              +'case when e.full_name is null then "- No assigned personnel" '
              +'else e.full_name end as "Employee" , '
              +'case when e.full_name is null then "-" '
              +'else case when e.manager is null then "Manager" else "Personnel" '
              +'end end as "Role" from department d '
              +'left join department_staff s on (s.dept_no=d.dept_no) '
              +'left join employee e on (e.employee_no=s.emp_no) '
              +(dept_no ? `where d.dept_no=${dept_no} order by `
                        : 'order by d.dept_no,')
              +'e.manager,s.emp_no';
    };


    function renderData(dataset) {
        if ((!dataset)||(dataset.length<1)) {return false};
        const numericDatatype=typeof(1);
        privateRenderData(dataset,getDataProperties(dataset));

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
                    const intvalue=   (   (fldtype===numericDatatype)
                                        &&(Number.isInteger(fldvalue)) )
                                    ||(fldvalue===null);
                    if (isUndefinedNullEmpty(result[fldkey],false)) {
                        result[fldkey]={type:fldtype,isint:intvalue,
                                                        width:fldkey.length};
                    } else if (!intvalue) {result[fldkey].isint=false};
                };
            });
            aDataset.forEach(datarow=>{
                for(let fldkey in datarow) {
                    if (typeof(datarow[fldkey])===numericDatatype) {
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


    async function flatify(rdbms,param_dept_no,param_emp_no) {
        if (!rdbms) {return false};
        let errorflag=false, transactionflag=false, errorstep='';
        try {
            const tmp_dept_no=rdbms.escape(param_dept_no);
            const verify_valid_param_dept_no = {
                steptitle :  'Validate supplied PARAM_DEPT_NO',
                statement :  `select dept_no,title from department `
                            +`where dept_no=${tmp_dept_no}`,
                resultmsg :  `No department exists with dept_no=${tmp_dept_no}`,
            };
            let qres=await executeSQLstatement(verify_valid_param_dept_no);
            if (qres.length<1) {throw verify_valid_param_dept_no.resultmsg};
            const target_dept_no=qres[0].dept_no, dept_title=qres[0].title;
            const tmp_emp_no=rdbms.escape(param_emp_no);
            const verify_valid_param_emp_no = {
                steptitle :  'Validate supplied PARAM_EMP_NO',
                statement :  `select employee_no,full_name from employee `
                            +`where employee_no=${tmp_emp_no}`,
                resultmsg :  `No employee exists with emp_no=${tmp_emp_no}`,
            };
            qres=await executeSQLstatement(verify_valid_param_emp_no);
            if (qres.length<1) {throw verify_valid_param_emp_no.resultmsg};
            const target_emp_no=qres[0].employee_no, emp_name=qres[0].full_name;
            const emp_no_manager_of_dept_no = {
                steptitle :  'Check if TARGET_EMP_NO already manager of TARGET_DEPT_NO',
                statement :  `select ifnull(e.manager,-1) as "manager" from employee e `
                            +`join department_staff s on (s.emp_no=e.employee_no) `
                            +`join department d on (d.dept_no=s.dept_no) `
                            +`where d.dept_no=${target_dept_no} `
                            +`and e.employee_no=${target_emp_no} `,
                resultmsg :  `Employee with emp_no=${target_emp_no} is already `
                            +`manager of department with dept_no=${target_dept_no}`,
            };
            const flatifymessage='\n'+`Flatify: setting employee [${emp_name
                                    }] with emp_no=[${target_emp_no}]`+'\n'
                                    +`to be the manager of department [${dept_title
                                    }] with dept_no=[${target_dept_no}]`;
            const remove_emp_no_from_depts = {
                steptitle :  'Remove TARGET_EMP_NO from any department if not is manager',
                statement :  `delete from department_staff where emp_no = ( `
                            +`select employee_no from employee `
                            +`where employee_no=${target_emp_no} `
                            +`and not manager is null ) `,
            };
            const mark_emp_no_as_a_manager = {
                steptitle :  'Mark TARGET_EMP_NO as a manager',
                statement :  `update employee set manager=null `
                            +`where employee_no=${target_emp_no} `,
            };
            const assign_emp_no_to_dept_no = {
                steptitle :  'Assign TARGET_EMP_NO to TARGET_DEPT_NO',
                statement :  `insert into department_staff (dept_no,emp_no) `
                            +`values (${target_dept_no},${target_emp_no}) `,
            };
            const set_dept_no_employees_manager = {
                steptitle :  'Set others in TARGET_DEPT_NO to have TARGET_EMP_NO as manager',
                statement :  `update employee set manager=${target_emp_no} `
                            +`where employee_no in ( `
                            +`select emp_no from department_staff `
                            +`where dept_no=${target_dept_no} `
                            +`and not emp_no=${target_emp_no} ) `,
            };
            qres=await executeSQLstatement(emp_no_manager_of_dept_no);
            if ((qres.length>0)&&(qres[0].manager===-1))
                {throw emp_no_manager_of_dept_no.resultmsg};
            console.log(flatifymessage);
            errorstep='Starting transaction';
            await rdbms.beginTransaction();
            transactionflag=true;
            await executeSQLstatement(remove_emp_no_from_depts);
            await executeSQLstatement(mark_emp_no_as_a_manager);
            await executeSQLstatement(assign_emp_no_to_dept_no);
            await executeSQLstatement(set_dept_no_employees_manager);
        } catch(anError) {
            const errormsg=anError.sqlMessage?anError.sqlMessage
                 :anError.message?anError.message:anError;
            console.log('\nFlatify Error');
            errorstep?console.log('attempt :',errorstep):undefined;
            anError.code?console.log('code    :',anError.code):undefined;
            console.log('message :',errormsg);
            errorflag=true;
        } finally {
            if (transactionflag) {
                if (errorflag) {await rdbms.rollback}
                else {
                    await rdbms.commit;
                    renderData(await rdbms.execSQL(departmentSelect()));
                };
            };
        };
        return !errorflag;
        async function executeSQLstatement(stepObj) {
            errorstep=stepObj.steptitle;
            return await rdbms.execSQL(stepObj.statement);
        };
    };
};


;

