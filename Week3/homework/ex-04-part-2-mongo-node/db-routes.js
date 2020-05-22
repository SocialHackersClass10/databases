
{
    'use strict';

    const conxparams = {useNewUrlParser:true, useUnifiedTopology:true};
    const mongoose = require('mongoose');
    mongoose.pluralize(null);
    mongoose.set('useFindAndModify',false);

    const city=getDBModel('city',{
        Name        : String,
        CountryCode : String,
        District    : String,
        Population  : Number    });
    const country=getDBModel('country',{
        Code : String,
        Name : String   });

    module.exports = {
        initializeConnection : async (conxstr) => {
            let result={ok:true};
            try {await mongoose.connect(conxstr,conxparams)}
            catch(anError) {result=getDBErrorText('connect',anError)};
            return result;
        },
        getCountries : async () => {
            const steptitle=`retrieve "${country.collection.name}" collection`;
            let result={ok:true,data:[]};
            try {
                const dsc=await country.find({},'Code Name').sort({Name:1});
                if (dsc.length<1) {throw `The database collection is empty`}
                dsc.forEach(({Code,Name})=>result.data.push({Code,Name}));
            } catch(anError) {result=getDBErrorText(steptitle,anError)};
            return result;
        },
        getCountryCities : (req,res,next) => {
            const targetCC=req.params.code;
            city.find({CountryCode:targetCC},'Name District Population'
                                            ,{sort:{Name:1}},(err,data)=>{
                if (err) {res.status(500).json({error:getDBErrorObj(err)})}
                else res.status(200).json(data);
            });
        },
        createCity : (req,res,next) => {
            const cityData=req.body;
            city.create(cityData,(err,data)=>{
                if (err) {res.status(500).json({error:getDBErrorObj(err)})}
                else res.status(200).json(data);
            });
        },
        updateCity : (req,res,next) => {
            const cityID=req.params.id, cityData=req.body;
            city.findByIdAndUpdate(cityID,{$set:cityData},err=>{
                if (err) {res.status(500).json({error:getDBErrorObj(err)})}
                else res.status(200).json({ok:true});
            });
        },
        deleteCity : (req,res,next) => {
            const cityID=req.params.id;
            city.findByIdAndDelete(cityID,err=>{
                if (err) {res.status(500).json({error:getDBErrorObj(err)})}
                else res.status(200).json({ok:true});
            });
        },
    };

    function getDBErrorObj(argError) {
        const result={};
        if (argError.status) result.status=argError.status;
        if (argError.code) result.code=argError.code;
        if (argError.message) result.message=argError.message;
        return result;
    };

    function getDBErrorText(anAction,argError) {
        return { message:       'Error accessing Atlas MongoDB:\n'
                               +`    Occured while trying to ${anAction}`+'\n'
                +(argError.code?`    Code   : ${argError.code}`+'\n':'')
                               +'    Message: '
                +(argError.message?argError.message:argError)+'\n',
            ok:false,
        };
    };

    function getDBModel(aName,aSchema){
        return mongoose.model(aName,new mongoose.Schema(aSchema,{collection:aName}));
    }

};


;

