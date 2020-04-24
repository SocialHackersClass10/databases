
{
    'use strict';

    exports.getConnectionParams = function () {
        const sqlParamsFile='./resources/mysql-params.json';
        const defArgHost='localhost';
        const defArgPort=3306;
        const errorMsg=
              'This program requires the "mysql connection parameters" in the file:\n'
            + `     ${sqlParamsFile}`+'\n\nstructured as follows:\n     {\n'
            + '        "host"     : "<INSERT_YOUR_MYSQL_HOST_ADDRESS_OR_IP_HERE>" ,\n'
            + '        "port"     :  <INSERT_YOUR_MYSQL_PORT_NUMBER_HERE> ,\n'
            + '        "user"     : "<INSERT_YOUR_MYSQL_USER_NAME_HERE>" ,\n'
            + '        "password" : "<INSERT_YOUR_MYSQL_USER_PASSWORD_HERE>"\n     }'
            + '\n\nwhere:\n- "host" and "port" are optional, '
            + 'and if omitted, will be assigned\n'
            + `        default values "${defArgHost}" and ${defArgPort} respectively`
            + '\n\n- "user" and "password" are required and must be provided therein.';
        let result=undefined;
        try {result=require(sqlParamsFile)} catch(anError) {};
        if (missingParams(result)) {console.log('\n'+errorMsg+'\n'); return undefined};
        return result;
        function missingParams(conxParams) {
            const result=(     invalidValue(conxParams)
                            || invalidValue(conxParams.user,true)
                            || invalidValue(conxParams.password,true) );
            if (!result) {
                if (invalidValue(conxParams.host,true)) {conxParams.host=defArgHost};
                if (invalidValue(conxParams.port,true)) {conxParams.port=defArgPort};
            };
            return result;
        };
    };

    function invalidValue(chkVariable,chkEmpty=false) {
        const isEmptyStr=()=>((chkEmpty)&&(String(chkVariable).trim()===''));
        return (chkVariable==null)||(chkVariable==undefined)||(isEmptyStr());
    };

};


;

