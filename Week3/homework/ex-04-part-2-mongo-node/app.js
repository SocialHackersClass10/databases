
{
    'use strict';
    console.log(' ');

    const path = require('path');
    const fs = require("fs");
    const resources = {
        dbroutes_js      : {critical:true,  filename:fixPath('./db-routes.js') },
        package_json     : {critical:false, filename:fixPath('./package.json') },
        index_handlebars : {critical:true,  filename:fixPath('./views/index.handlebars') },
        index_js         : {critical:true,  filename:fixPath('./views/index.js') },
        main_handlebars  : {critical:true,  filename:fixPath('./views/layouts/main.handlebars') },
        styles_css       : {critical:true,  filename:fixPath('./views/layouts/styles.css') },
        mongodb_key      : {critical:true,  filename:fixPath('./resources/mongodb-key.json') },
    };
    const atlasConxStr = getAtlasConnectionString();
    if ((!atlasConxStr)||(!verifyResourceExistance(resources))) {return false};

    const express    = require('express');
    const serverApp  = express();
    const serverPort = 3000;
    const handlebars = require('express-handlebars');
    let   countries  = [];
    const dbroutes   = require(resources.dbroutes_js.filename);

    serverApp.engine('handlebars', handlebars());
    serverApp.set('view engine', 'handlebars');
    serverApp.use(express.json());
    serverApp.use((error,req,res,next)=>{
        if (error instanceof SyntaxError) {
            return res.status(400).end('Request contains syntax error');
        };
        next();
    });

    serverApp.get('/',(req,res)=>res.render('index',{countries}));
    serverApp.get('/index.js',   (req,res)=>res.sendFile(resources.index_js.filename));
    serverApp.get('/styles.css', (req,res)=>res.sendFile(resources.styles_css.filename));

    serverApp.get   ('/cities/:code',dbroutes.getCountryCities);
    serverApp.post  ('/cities'      ,dbroutes.createCity);
    serverApp.put   ('/cities/:id'  ,dbroutes.updateCity);
    serverApp.delete('/cities/:id'  ,dbroutes.deleteCity);

    asyncStartServer();

    async function asyncStartServer(){
        let dbres=await dbroutes.initializeConnection(atlasConxStr);
        if (dbres.ok) {dbres=await dbroutes.getCountries()};
        if (dbres.ok) {countries=dbres.data}
        else {console.log(dbres.message); process.exit(1)};
        const msg=`Atlas MongoDB CRUD API - listening on port ${serverPort}`;
        serverApp.listen(serverPort,()=>console.log(msg+'\n'));
    };

    function getAtlasConnectionString(){
        const errMsg = 'The server requires the Atlas MongoDB '
                        +'connection string config file:\n'
                + `     ${resources.mongodb_key.filename}`+'\ncontaining:\n'
                + '     { "KEY" : "YOUR_ATLAS_MONGODB_NODEJS'
                                +'_CONNECTION_STRING_HERE" }\n';
        let result=undefined;
        try {result=require(resources.mongodb_key.filename).KEY} catch(anError) {};
        if (!result) {console.log(errMsg)};
        return result;
    };

    function verifyResourceExistance(aList){
        let critical_text='', warning_text='';
        Object.keys(aList).forEach(aKey=>{if (!existFile(aList[aKey].filename)){
            if (aList[aKey].critical) {critical_text+='   '+aList[aKey].filename+'\n'}
            else {warning_text+='   '+aList[aKey].filename+'\n'}};
        });
        if (warning_text!=='') {
            console.log( 'Following non-essential files are missing:\n\n'+warning_text+'\n'
                +'   While their presence is not required for the application,\n'
                +'   it may however indicate that the folder structure has been corrupted.\n\n'
                +'   Restoring the original application folder structure should fix this.\n\n');
        };
        if (critical_text==='') {return true}
        else {
            console.log( 'Following essential application resources are missing:\n\n'+critical_text+'\n'
                +'   Their presence is required and critical to the application.\n'
                +'   Please restore/install the original application folder structure.\n\n'
                +'   Also please execute "npm i" to install any (possibly missing) required libraries.\n\n');
            return false;
        };
    };

    function fixPath(aFilename){
        return path.join(__dirname,aFilename);
    };

    function existFile(aFilename){
        return (fs.existsSync(aFilename))&&(fs.lstatSync(aFilename).isFile());
    };

};


;

