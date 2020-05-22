
{
    'use strict';

    const conxParams=require('../common/mysql-params.js').getConnectionParams();
    if (!conxParams) {return false};
    const rdbms=require('../common/mysql-wrapper.js').RDBMS(require('mysql'),conxParams);
    if (!rdbms) {return false};
    const actions=require('./mysql-actions');
    const prompt=require('prompt');
    const promt_get=require('util').promisify(prompt.get.bind(this));

    mainProccess();

    async function mainProccess() {
        try {
            await rdbms.execSQL('use '+actions.databaseName);
            actions.renderData(await rdbms.execSQL(actions.departmentSelect()));
            const dept_no=await userInput('dept_no','Enter flatify department number');
            const emp_no=await userInput('emp_no','Enter flatify employee number');
            console.log('\nFlatify',(await actions.flatify(rdbms,dept_no,emp_no)
                                    ?'success':'unsuccessful'));
        } catch(anError) {
            if (anError.message==='canceled') {
                console.log('\n\nApplication was interrupted by user');
            } else {
                console.log('\n\nCaught an exception:\n');
                console.log(anError);
            }
        } finally {
            console.log('');
            await rdbms.disconnect();
            console.log('');
        };
    };

    async function userInput(keyName='input',msgText) {
        if (msgText) {console.log('\n'+msgText)};
        prompt.start();
        const result=await promt_get(keyName);
        return result[keyName];
    };
};


;

