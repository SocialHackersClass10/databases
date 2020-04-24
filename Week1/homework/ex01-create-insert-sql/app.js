
{
    'use strict';

    const conxParams = require('./mysql-params').getConnectionParams();

    if (conxParams) {require('./mysql-actions').executeSQLsequence(conxParams)};

};


;

