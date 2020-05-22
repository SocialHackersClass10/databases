
{
    'use strict';

    const util = require( 'util' );

    exports.RDBMS = function(mysql,cArgs) {
        const conx = mysql.createConnection(cArgs);
        return {
            execSQL(sqlStatement,sqlArguments) {
                return util.promisify(conx.query).call(conx,sqlStatement,sqlArguments);
            },
            disconnect() {
                if ((!conx)||(conx.state==='disconnected')) {return true}
                else {return util.promisify(conx.end).call(conx)};
            },
            beginTransaction() {
                return util.promisify(conx.beginTransaction).call(conx);
            },
            commit() {
                return util.promisify(conx.commit).call(conx);
            },
            rollback() {
                return util.promisify(conx.rollback).call(conx);
            },
            escape(sqlArgument) {
                return conx.escape(sqlArgument)
            },
        };
    };

};


;

