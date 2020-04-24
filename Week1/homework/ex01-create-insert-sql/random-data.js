
{
    'use strict';


    /*  -  -  -  -  -  -  module export section  -  -  -  -  -  -  */

    exports.getRandomInteger = getRandomInteger;
    exports.getRandomDate = getRandomDate;
    exports.getRandomTask = getRandomTask;
    exports.getRandomDept = getRandomDept;
    exports.getRandomName = getRandomName;
    exports.isUndefinedNullEmpty = isUndefinedNullEmpty;



    /*  -  -  -  -  -  -  -  code section  -  -  -  -  -  -  -  -  */

    function getRandomInteger(minValue=0,maxValue=minValue) {
        minValue=internalValidate(minValue,'minValue');
        maxValue=internalValidate(maxValue,'maxValue');
        if (minValue>=maxValue) {
            return maxValue;
        } else {
            return minValue+Math.floor(Math.random()*(maxValue-minValue+1));
        };
        function internalValidate(aValue,aName) {
            const invalidArgumentText='getRandomInteger: invalid argument: ';
            let result;
            try {result=Number(aValue)}catch(er){};
            if (isUndefinedNullEmpty(result)||isNaN(result)) {
                throw new SyntaxError(invalidArgumentText+aName);
            };
            return result;
        };
    };


    function getRandomDate(minDate,maxDate) {
        return new Date(getRandomInteger(validateValue(minDate,new Date(0)),
                                         validateValue(maxDate,new Date())));
        function validateValue(theDate,defDate) {
            let result=new Date(theDate).valueOf();
            if (!result) {result=defDate.valueOf()};
            return result;
        };
    };


    const originTaskList = {
        pt1 : [ 'Hyper-Binary Research, seeking',  'Electrostatic Quantum Soup:',
                'Pseudo Evolution: Understanding', 'Coherence & Transcendence:',
                'Empathy, Exploration and',        'The Bio-electrical Seeds of',
                'Dreamspace Aerodynamics and',     'Exploration of Inner Shelf and',
                'Science, Essence of Nature, and', 'Artificial Decadence, a quest for',     ],
        pt2 : [ 'the Theorem of Nothing Possible', 'the Insanity/Divinity foundation',
                'Aggressive Virtual Housing',      'fuzzy beauty administration',
                'the Dreamtime prophecy project',  '42 ways to thwart a party',
                'Anti-dark matter Cyberware',      'the Outer Pocket Dimensions',
                'Unified Clinical Neutrality',     'the Collapsing subwave initiative',     ],
    };
    const taskList = {};

    function getRandomTask() {
        return phraseComposer(taskList,[1,2],
                    getMaxValidIndexRepopulateEmpty(taskList,originTaskList));
    };


    const originDeptList = {
        pt1 : [ 'Mundane',       'Marginal',  'Petty',        'Peripheral',        'Banal',
                'Trivial',       'Inferior',  'Minor',        'Important',         'Lesser',    ],
        pt2 : [ 'Chapter',       'Bureau',    'Department',   'Office',            'Sector',
                'Segment',       'Agency',    'Division',     'Branch',            'Section',   ],
        pt3 : [ 'Unimaginative', 'Infernal',  'Nonessential', 'Insignificant',     'Lost',
                'Stereotypical', 'Temporal',  'Disputable',   'Controversial',     'Divine',    ],
        pt4 : [ 'Belly-dancing', 'Awareness', 'Bureaucracy',  'Intelligence',      'Bigotry',
                'Cyber-physics', 'Knowledge', 'Perception',   'Misunderstandings', 'Diplomacy', ],
    };
    const originDeptSequence = {
        pt1 : [  [3,1,4,2],  [3,1,2,'of',4],  [2,'of',1,4],  [3,2,'of',1,4],  [2,'of',1,3,4],
                 [1,3,4,2],  [1,3,2,'of',4],  [2,'of',3,4],  [1,2,'of',3,4],  [2,'of',3,1,4],  ],
    };
    const deptList = {};
    const deptSqnc = {};

    function getRandomDept() {
        return phraseComposer(deptList,getRandomSequence(deptSqnc,originDeptSequence),
                                getMaxValidIndexRepopulateEmpty(deptList,originDeptList));
    };


    const originNameList = {
        pt1 : [
            'Gunda',        'Derval',       'Eibhear',      'Amber',        'Yamura',
            'Alla',         'Islay',        'Loukios',      'Egidijus',     'Robert',
            'Niccolò',      'Ashlee',       'Linsay',       'Annie',        'Boris',
            'Merete',       'Renata',       'Jovana',       'Cecilia',      'Shankar',
            'Mira',         'Kamala',       'Aloxindru',    'Quirinus',     'Guilherme',
            'Deepa',        'Barclay',      'Sashkia',      'Harlow',       'Ayaka',
            'Dragoslav',    'Jacenty',      'Nimrad',       'Victoria',     'Arkadios',     ],
        pt2 : [
            'Dominick',     'Leontius',     'Corbinian',    'Koldobika',    'Ebulrehman',
            'Clinton',      'Gull',         'Afsun',        'Kosuke',       'Avraamu',
            'Bran',         'Antonie',      'Raul',         'Naiche',       'Faisal',
            'Vakhtang',     'Raymundo',     'Jonathan',     'Sif',          'Kawacatoose',
            'Ishtar',       'Damokles',     'Salathiel',    'Aloisio',      'Dai',
            'Kumar',        'Axel',         'Meinrad',      'Clemens',      'Din',
            'John-Paul',    'Enos',         'Feline',       'Juris',        'Mirim',        ],
        pt3 : [
            'Salmon',       'Tash',         'Zuiderduin',   'Megaros',      'Bonelli',
            'Hueber',       'Ansaldi',      'MacGowan',     'Stack',        'McNeil',
            'Peter',        'Sciarra',      'Pfeiffer',     'Rameckers',    'Yeung',
            'Killam',       'Presley',      'Gal',          'Holt',         'Collingwood',
            'Agramunt',     'Fabre',        'Rockburn',     'Akiyama',      'Bondesan',
            'Balazs',       'Walter',       'Abbate',       'Chaudhri',     'Upton',
            'Forsberg',     'Dumitru',      'Glass',        'Connolly',     'Beretti',      ],
    };
    const originNameSequence = {
        pt1 : [ [1,2], [1,3], [1,2,3], [2,1], [2,3], [2,1,3], [3,1], [3,2], [3,1,2], ],
    };
    const nameSqnc = {};
    const nameList = {};

    function getRandomName() {
        return phraseComposer(nameList,getRandomSequence(nameSqnc,originNameSequence),
                                getMaxValidIndexRepopulateEmpty(nameList,originNameList));
    };


    function getRandomSequence(targetSequence,originSequence) {
        const maxsqncid=getMaxValidIndexRepopulateEmpty(targetSequence,originSequence);
        return targetSequence.pt1.splice(getRandomInteger(0,maxsqncid),1)[0];
    };


    function phraseComposer(anObj,aSequence,maxidx) {
        return aSequence.reduce((aTotal,aValue)=>
            aTotal+(Object.keys(anObj).indexOf('pt'+aValue)<0
                ? (aValue.trim()===''?'':aValue+' ')
                : anObj['pt'+aValue].splice(getRandomInteger(0,maxidx),1)+' '
            ),'').trim();
    };


    function getMaxValidIndexRepopulateEmpty(targetList,originList) {
        let maxidx=getObjectListsMinMaxIndex(targetList);
        if (maxidx<0) {
            for (let i in originList) {targetList[i]=[...originList[i]]};
            maxidx=getObjectListsMinMaxIndex(targetList);
        };
        return maxidx;
    };


    function getObjectListsMinMaxIndex(anObj) {
        const result=Math.min(...Object.keys(anObj).map(k=>anObj[k].length-1));
        return (result==Infinity?-1:result);
    };


    function isUndefinedNullEmpty(theValue,chkEmpty=true) {
        const isEmptyString=()=>((chkEmpty)&&(String(theValue).trim()===''));
        return (theValue==undefined)||(theValue==null)||(isEmptyString());
    };


    //  * * *  only for test purposes, disable this export before release
    //
    //  exports.getOrigin=getOriginList;
    //
    function getOriginList(listID) {
        switch(listID) {
            case  2 : return mergeList(originTaskList);
            case  1 : return mergeList(originDeptList);
            case  0 : return mergeList(originNameList);
            default : return [];
        };
        function mergeList(aList) {
            const maxidx=getObjectListsMinMaxIndex(aList);
            let result=[];
            for (let i=0; i<=maxidx; i++) {
                result.push(Object.keys(aList).reduce((s,k)=>s+aList[k][i]+' ','').trim());
            };
            return result;
        };
    };

};


;

