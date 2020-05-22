
'use strict';

{
    document.getElementById('id_page_title').innerHTML='Atlas MongoDB CRUD app';
    const selectCountry=initializeDOMelement('id_country_select',false,true);
    const containerMessage=initializeDOMelement('id_message_container',true);
    const containerNewcity=initializeDOMelement('id_newcity_container',true);
    const containerCitylist=initializeDOMelement('id_citylist_container',true);
    const dataRequestEndpoint='./cities/';
    let selectedCountryName,cities,enabledCountryChangeHandler=false;

    window.onload=initializePage;

    function initializeDOMelement(elementID,isHidden=false,isDisabled=false){
        const result=document.getElementById(elementID);
        if (result) {result.hidden=isHidden; result.disabled=isDisabled};
        return result;
    };

    async function initializePage() {
        selectCountry.disabled=true;
        toggleSelectCountryChangeEventHandler(true);
        selectedCountryChange();
        selectCountry.disabled=false;
        selectCountry.focus();
    };

    function toggleSelectCountryChangeEventHandler(doEnable=true){
        if (doEnable) {selectCountry.addEventListener('change',selectedCountryChange)}
        else {selectCountry.removeEventListener('change',selectedCountryChange)};
        enabledCountryChangeHandler=doEnable;
    };

    function showProccessMessage(atext){
        containerMessage.hidden=!(containerCitylist.hidden=containerNewcity.hidden=(atext));
        if(atext){containerMessage.innerHTML=atext};
    };

    async function selectedCountryChange(){
        const privateHandlerEnabled=toggleEventHandling(false);
        const privateCountryCode=selectCountry.value;
        try {
            selectedCountryName=selectCountry.options[selectCountry.selectedIndex].text;
            showProccessMessage(`Retrieving Cities of ${selectedCountryName}. Please wait...`);
            try {
                cities=await issueDataRequest('GET',dataRequestEndpoint+privateCountryCode);
                containerNewcity.innerHTML=`<p>Add a new City</p>`;
                createCityControls(containerNewcity,{},true);
                if (cities.length<1) {
                    containerCitylist.innerHTML=selectedCountryName+' has no cities';
                } else {
                    containerCitylist.innerHTML=`<p>Cities of ${selectedCountryName}</p>`;
                    cities.forEach((lmnt,indx)=>createCityControls(containerCitylist,lmnt,(indx==0)));
                };
                showProccessMessage();
                window.dispatchEvent(new Event('resize'));
            } catch(anError){
                showProccessMessage(anError);
                cities=[];
            };
        } finally {
            if (privateCountryCode!==selectCountry.value) selectedCountryChange();
            if (privateHandlerEnabled) toggleEventHandling();
            // .../JavaScript3/Week2/homework/project-hack-your-repo-II
        };
        function toggleEventHandling(newState=true){
            const result=enabledCountryChangeHandler;
            toggleSelectCountryChangeEventHandler(newState);
            return result;
        };
    };

    function createCityControls(aParent,aCity,alwaysShowTitles){
        const datarowContainer=newElement('DIV',aParent,{class:'cls_datarow_container'});
        if (!alwaysShowTitles){datarowContainer.style.borderTop='1px solid grey'};
        const citynameContainer=setWidth('32%','320px',newElement('DIV',datarowContainer,{class:'cls_inline_block'}));
        const districtContainer=setWidth('32%','320px',newElement('DIV',datarowContainer,{class:'cls_inline_block'}));
        const populusContainer =setWidth('11%','110px',newElement('DIV',datarowContainer,{class:'cls_inline_block'}));
        const actionsContainer =setWidth('25%','230px',newElement('DIV',datarowContainer,{class:'cls_inline_block'}));
        const isNewDocument=Object.entries(aCity).length<1;
        const actUpdateContainer=setWidth((isNewDocument?'100%':'50%'),null,newElement('DIV',actionsContainer,{class:'cls_inline_block cls_button_container'}));
        const actDeleteContainer=(isNewDocument?undefined:setWidth('50%',null,newElement('DIV',actionsContainer,{class:'cls_inline_block cls_button_container'})));
        aCity.controls={
            citynameTitle:newElement('P',citynameContainer,{text:'Name',hidden:'true'}),
            citynameInput:bindEvents(setWidth('100%',null,newElement('INPUT',citynameContainer,{type:'text'})),{input:citynameChange},aCity),
            districtTitle:newElement('P',districtContainer,{text:'District',hidden:'true'}),
            districtInput:bindEvents(setWidth('100%',null,newElement('INPUT',districtContainer,{type:'text'})),{input:districtChange},aCity),
            populusTitle :newElement('P',populusContainer,{text:'Population',hidden:'true'}),
            populusInput :bindEvents(setWidth('100%',null,newElement('INPUT',populusContainer,{type:'text',class:'cls_text_align_right'})),{input:populusChange},aCity),
            buttonUpdate :bindEvents(setWidth('100%',null,newElement('BUTTON',actUpdateContainer,{text:(isNewDocument?'Add this City':'Update'),disabled:'true'})),{click:dataUpdate},aCity),
            buttonDelete :(isNewDocument?undefined:bindEvents(setWidth('100%',null,newElement('BUTTON',actDeleteContainer,{text:'Delete'})),{click:dataDelete},aCity)),
            isNewDocument,alwaysShowTitles,countryCode:selectCountry.value,
        };
        initiateInputValues(aCity);
        window.addEventListener('resize',resizeView.bind(aCity));
        return aCity
        function setWidth(argWidth,minWidth,aControl){
            if (aControl) {if(minWidth){aControl.style.minWidth=minWidth}; if(argWidth){aControl.style.width=argWidth}};
            return aControl;
        };
        function bindEvents(aControl,eventHandlers,aContext){
            Object.entries(eventHandlers).forEach(([event,handler])=>aControl.addEventListener(event,handler.bind(aContext)));
            return aControl;
        };
    };

    function resizeView(e){
        this.controls.citynameTitle.hidden=this.controls.districtTitle.hidden=this.controls.populusTitle.hidden=!(
            (this.controls.alwaysShowTitles)||(this.controls.citynameInput.offsetTop!==this.controls.populusInput.offsetTop));
    };

    function validateString(paramValue,paramTitle,{min:minLength,max:maxLength},sourceValue=''){
        let message='';
        const stringValue=String(paramValue).trim();
        const stringLength=stringValue.length;
        const passed=[{
            text:`Expected a sequence of characters with length between ${minLength
                   } and ${maxLength}.`+'\n'+`The current length is ${stringLength}`,
            rule:()=>isBetween(stringLength,minLength,maxLength),
            }].every(({text,rule})=>{
                const pass=rule();
                if (!pass) message=text;
                return pass;
            });
        return {passed,value:stringValue,message,changed:(stringValue!==sourceValue)};
    };

    function validateNumber(paramValue,paramTitle,{min:minValue,max:maxValue},sourceValue=0){
        let message='';
        const stringValue=String(paramValue).trim();
        const numberValue=Number(stringValue);
        const passed=[{
            text:`Expected an integer value between ${formatInteger(minValue)
                                              } and ${formatInteger(maxValue)}`,
            rule:(strValue,numValue)=>(strValue.length>0)
                &&(Number.isInteger(numValue))
                &&(isBetween(numValue,minValue,maxValue)),
            }].every(({text,rule})=>{
                const pass=rule(stringValue,numberValue);
                if (!pass) message=text;
                return pass;
            });
        return {passed,value:numberValue,message,changed:(numberValue!==sourceValue)};
    };

    function constraints() {return{
        cityname:{ validate:{min:2, max:75},       confirm:{min:40, max:4} },
        district:{ validate:{min:0, max:60},       confirm:{min:30, max:4} },
        populus :{ validate:{min:0, max:20000000}, confirm:{min:2000000, max:99} },
    }};

    function citynameChange(e){
        this.controls.citynameValid=validateString(e.target.value,this.controls.citynameTitle.textContent,constraints().cityname.validate,this.Name);
        if (this.controls.allowButtonUpdates) {
            this.controls.datasetChanged=(this.controls.isNewDocument)||(hasDataChanged(this.controls));
            updateButtons(this);
        };
    };

    function districtChange(e){
        this.controls.districtValid=validateString(e.target.value,this.controls.districtTitle.textContent,constraints().district.validate,this.District);
        if (this.controls.allowButtonUpdates) {
            this.controls.datasetChanged=(this.controls.isNewDocument)||(hasDataChanged(this.controls));
            updateButtons(this);
        };
    };

    function populusChange(e){
        this.controls.populusValid=validateNumber(e.target.value,this.controls.populusTitle.textContent,constraints().populus.validate,this.Population);
        if (this.controls.allowButtonUpdates) {
            this.controls.datasetChanged=(this.controls.isNewDocument)||(hasDataChanged(this.controls));
            updateButtons(this);
        };
    };

    function hasDataChanged({citynameValid,districtValid,populusValid}){
        return (citynameValid.changed)||(districtValid.changed)||(populusValid.changed);
    };

    function updateButtons(aCity){
        const {isNewDocument,datasetChanged,buttonUpdate,buttonDelete,
                            citynameValid,districtValid,populusValid}=aCity.controls;
        buttonUpdate.disabled=!((citynameValid.passed)&&(districtValid.passed)
                                &&(populusValid.passed)&&(datasetChanged));
        buttonUpdate.title=(buttonUpdate.disabled?('This function is disabled because:\n'
                    +disabledmsg('cityname')+disabledmsg('district')+disabledmsg('populus')
                    +(isNewDocument?'':(datasetChanged?'':'\nData has no changes\n')))
                :(isNewDocument ?'This will Insert this new City into the Database'
                                :'This will update the Database with new value(s)'));
        if (!isNewDocument) {
            buttonDelete.title=(aCity.controls.datasetChanged
                                ?'This will Undo all changes and revert original values'
                                :'This will Delete the City from the Database');
            buttonDelete.textContent=(aCity.controls.datasetChanged?'Undo':'Delete');
            buttonDelete.disabled=false;
        };
        function disabledmsg(ctrlname){
            const {textContent:title}=aCity.controls[ctrlname+'Title'];
            const {passed,message}=aCity.controls[ctrlname+'Valid'];
            return (passed?'':'\nInvalid '+title+':\n'+message+'\n');
        };
    };

    function disableUIcontrols(aButton){
        selectCountry.disabled=true;
        aButton.disabled=true;
    };

    async function dataUpdate(e){
        try {
            if (this.controls.isNewDocument) {
                const aText='This City '+(this.controls.districtInput.value?'and District ':'')+'already exists\n\n\n'+'Please confirm the create request\n';
                if ((isUniqueCity({Name:this.controls.citynameValid.value,District:this.controls.districtValid.value}))||(confirm(aText))){
                    showProccessMessage('Data request: Insert new City...');
                    disableUIcontrols(e.target);
                    await issueDataRequest('POST',dataRequestEndpoint,{
                        Name       :this.controls.citynameValid.value,
                        District   :this.controls.districtValid.value,
                        Population :this.controls.populusValid.value,
                        CountryCode:this.controls.countryCode
                    });
                    await initializePage();
                };
            } else {
                showProccessMessage('Data request: Update City...');
                disableUIcontrols(e.target);
                const newValues={};
                if (this.controls.citynameValid.changed) newValues.Name      =this.controls.citynameValid.value;
                if (this.controls.districtValid.changed) newValues.District  =this.controls.districtValid.value;
                if (this.controls.populusValid.changed)  newValues.Population=this.controls.populusValid.value;
                await issueDataRequest('PUT',dataRequestEndpoint+this._id,newValues);
                await initializePage();
            };
        } catch(anError) {
            showProccessMessage(anError);
        };
    };

    async function dataDelete(e){
        if (this.controls.datasetChanged) {
            e.target.disabled=true;
            initiateInputValues(this);
            selectCountry.disabled=false;
            selectCountry.focus();
        } else try {
            const aText='You have requested the deletion of the City\n'
                       +this.controls.citynameInput.value+'\n\n'
                       +'This action can not be reverted, once performed\n\n\n'
                       +'Please confirm the delete request\n';
            if (confirm(aText)) {
                showProccessMessage('Data request: Delete City...');
                disableUIcontrols(e.target);
                await issueDataRequest('DELETE',dataRequestEndpoint+this._id);
                await initializePage();
            };
        } catch(anError) {
            showProccessMessage(anError);
        };
    };

    function isUniqueCity(cityData){
        return (cities)&&(!cities.some(lmnt=>Object.entries(cityData).every(([key,val])=>lmnt[key]===val)));
    };

    function triggerInputChanges(cityControls){
        cityControls.allowButtonUpdates=false;
        cityControls.citynameInput.dispatchEvent(new Event('input'));
        cityControls.districtInput.dispatchEvent(new Event('input'));
        cityControls.allowButtonUpdates=true;
        cityControls.populusInput.dispatchEvent(new Event('input'));
    };

    function initiateInputValues(aCity){
        aCity.controls.allowButtonUpdates=false;
        aCity.controls.citynameInput.value=(aCity.Name||'');
        aCity.controls.districtInput.value=(aCity.District||'');
        aCity.controls.populusInput.value=(aCity.Population||0);
        triggerInputChanges(aCity.controls);
    };

    function isBetween(aVal,aMin,aMax) {return ((aVal-aMin)*(aVal-aMax)<=0)};

    function formatInteger(aVal) {return aVal.toLocaleString()};

    function newElement(theTagname,theParent,theOptions={}){
        const lmnt=document.createElement(theTagname);
        Object.entries(theOptions).forEach(([aKey,aValue])=>{
            if (aKey==='text') {lmnt.textContent=aValue}
            else {lmnt.setAttribute(aKey,aValue)} });
        theParent.appendChild(lmnt);
        return lmnt;
    };

    function issueDataRequest(aMethod,anEndpoint,aBody={}){
        const params={method:aMethod};
        if (Object.keys(aBody).length>0) {
            params.headers={"Content-Type":"application/json; charset=utf-8"};
            params.body=JSON.stringify(aBody);
        };
        return fetch(anEndpoint,params).then(res=>{
            if (!res.ok) {return new Error(`HTTP ${res.status} - ${res.statusText}`)};
            return res.status===200?res.json():null;
        });
    };

}


;

