
{
    'use strict';

    exports.executeSQLsequence = executeSQLsequence;


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
        {   title   : 'Activate "world" database',
            command : `use world`,
            onErrorAbort : true,
        },
        {   title   : '1 - List all countries with population greater than 8 million',
            command : `select name as "Country" , Population from country `
                     +`where population > 8000000 order by name , population desc`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '2 - List all countries having “land” in their name',
            command : `select name as "Country" from country `
                     +`where name like '%land%' order by name`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '3 - List all cities with population between 500,000 and 1 million',
            command : `select name as "City" , countrycode as "Country" , Population `
                     +`from city where population between 500000 and 1000000 `
                     +`order by name , population desc`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '4 - List all countries on the continent of ‘Europe’',
            command : `select name as "Country" from country `
                     +`where continent = 'Europe' order by name`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '5 - List all countries in descending order of surface area',
            command : `select name as "Country" , surfacearea as "Surface Area" `
                     +`from country order by surfacearea desc , name`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '6 - List all cities in the Netherlands',
            command : `select ct.name as "City" from city ct `
                     +`join country cn on (cn.code=ct.countrycode) `
                     +`where cn.name = 'Netherlands' order by ct.name`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '7 - What is the population of Rotterdam?',
            command : `select ct.name as "City" , cn.name as "Country" , ct.Population `
                     +`from city ct join country cn on (cn.code=ct.countrycode) `
                     +`where ct.name = 'Rotterdam'`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '8 - List the top 10 countries by Surface Area',
            command : `select name as "Country" , surfacearea as "Surface Area" `
                     +`from country order by surfacearea desc limit 10`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '9 - List the top 10 most populated cities',
            command : `select ct.name as "City" , cn.name as "Country" , ct.Population `
                     +`from city ct join country cn on (cn.code=ct.countrycode) `
                     +`order by ct.population desc , ct.name limit 10`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : '10 - What is the total population of the world?',
            command : `select sum(population) as "World Total Population" from country`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : 'Bonus 1. Top 20 Populated countries sorted alphabetically by Name',
            command : `select name as "Country" , Population , Spot `
                     +`from (`
                     +`    select c2.code,c2.name,c2.surfacearea,c2.population`
                     +`    , (@c2rowcounter:=@c2rowcounter+1) as "Spot"`
                     +`    from country c2 , (select @c2rowcounter:=0) r2`
                     +`    order by c2.population desc limit 20 `
                     +`) tmp order by name`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
        {   title   : 'Bonus 2. List Top 50 densely populated countries sorted by Name',
            command : `select name as "Country" , surfacearea as "Surface Area" , Population `
                     +`from (`
                     +`    select c2.code,c2.name,c2.surfacearea,c2.population`
                     +`    from country c2 where c2.population > 0`
                     +`    order by (c2.surfacearea/c2.population) limit 50 `
                     +`) tmp order by name`,
            renderResult : renderQueryResults,
            onErrorAbort : false,
        },
    ];

    const maxScreenWidth=72;    //  84;     //  96;


    function renderQueryResults(aDataset) {
        if ((!aDataset)||(aDataset.length<1)) {return false};
        const numericDatatype=typeof(1);
        renderData(aDataset,getDataProperties(aDataset));

        function renderData(dataSet,dataProps) {
            const pds=' '.repeat(8);
            console.log(' ');
            dataSet.forEach((datarow,rowindex)=>{
                let rowstr=pds;
                if (rowindex===0) {
                    for (let fldkey in datarow) {
                        rowstr+=justifyText(fldkey,dataProps[fldkey]);
                    };
                    rowstr+='\n'+pds;
                    for (let fldkey in datarow) {
                        rowstr+=justifyText('-'.repeat(dataProps[fldkey].width)
                                                ,dataProps[fldkey]);
                    };
                    rowstr+='\n'+pds;
                };
                for (let fldkey in datarow) {
                    rowstr+=justifyText(datarow[fldkey],dataProps[fldkey]);
                };
                console.log(rowstr);
            });
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

        function getDataProperties(theData) {
            const result={};
            theData.forEach(datarow=>{
                for(let fldkey in datarow) {
                    let fldvalue=datarow[fldkey];
                    const fldtype=typeof(fldvalue);
                    if (fldtype===numericDatatype) {
                        datarow[fldkey]=fldvalue.toLocaleString();
                        fldvalue=datarow[fldkey];
                    };
                    const width=String(fldvalue).length
                    if (isUndefinedNullEmpty(result[fldkey],false)) {
                        result[fldkey]={
                            type :fldtype,
                            width:Math.max(width,fldkey.length)
                        };
                    } else if (result[fldkey].width<width) {
                        result[fldkey].width=width;
                    };
                };
            });
            return result;
        };
    };


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
            if (msgReason==='Attempt') {console.log('_'.repeat(maxScreenWidth),'\n')};
            console.log(` ${msgReason==='Attempt'?'Step':msgReason}${
                            msgSubject.trim()===''?'':': '}${msgSubject}`);
            if (lineAfter) {console.log('_'.repeat(maxScreenWidth),'\n')};
        };
    };


    function isUndefinedNullEmpty(theValue,chkEmpty=true) {
        const isEmptyString=()=>((chkEmpty)&&(String(theValue).trim()===''));
        return (theValue==undefined)||(theValue==null)||(isEmptyString());
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

