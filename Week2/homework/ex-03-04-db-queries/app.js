
{
    'use strict';

    const conxParams = require('../common/mysql-params.js').getConnectionParams();
    if (!conxParams) {return false};

    require('./mysql-actions').executeSQL(
        require('../common/mysql-wrapper.js').RDBMS(require('mysql'),conxParams)
        ,conxParams);

};


;

