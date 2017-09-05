sap.ui.controller("sap.ui.usage.analytics.documentation.TrakingEvents", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sap.ui.usage.analytics.documentation.TrakingEvents
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf sap.ui.usage.analytics.documentation.TrakingEvents
*/
	onBeforeRendering: function() {
		
        var jscodeone = "ut(‘send’,’customkey’,'{'customkey1':'example string 2','customkey3':'val3'}'); \n"
        	+"'send','customkey' are the keywords.\n"
        	+"\"customkey1\", \"customkey3\" are the keynames.\n"
        	+"\"Example string1\",\"Val3\" are the keyvalues."
        	 var jscodetextfieldone = this.getView().byId("jsSnippetTextcodeTEone");
        if (jscodetextfieldone != undefined)
            jscodetextfieldone.setText(jscodeone);
        
        var jscodetwo = "ut(‘send’,’rgid’,’customkey’,'{'customkey1':'example string2','customkey3':'val3'}') \n" 
        	+"'send','customkey' are the keywords.\n"
        	+"\"customkey1\",\"customkey3\" are the keynames.\n"
        	+"\"Example string1\",\"Val3\" are the keyvalues."
        	var jscodetextfieldtwo = this.getView().byId("jsSnippetTextcodeTEtwo");
       if (jscodetextfieldtwo != undefined)
           jscodetextfieldtwo.setText(jscodetwo);
       
       var jscodeMAN = "ut('config','alias','{\"A\":[<list of keynames to be mapped to A>], \"B\":[<list of keynames to be mapped to B>], \"C\":[<list of keynames to be mapped to C>]}');"
         	 var jscodetextfieldMAN = this.getView().byId("jsSnippetTextcodeMAN");
         if (jscodetextfieldMAN != undefined)
             jscodetextfieldMAN.setText(jscodeMAN);
         
         var jscodeCS = "var instance = {}; \n"
        	 +"instance.applicationid	= \"ap1\"; \n"
        	 +"instance.productname	= \"pc1\"; \n"
        	 +"instance.productversion	= \"12.04.1.3\"; \n"
        	 +"instance.productpatch	= \"0.01\"; \n"
        	 +"instance.installationid	= \"installation101\"; \n"
        	 +"configInfo.alias = '{\"A\":[<list of keynames to be mapped to A>], \"B\":[<list of keynames to be mapped to B>], \"C\":[<list of keynames to be mapped to C>]}'; \n"
        	 +"ut('create',JSON.stringify(instance));"
         	 var jscodetextfieldCS = this.getView().byId("jsSnippetTextcodeCS");
         if (jscodetextfieldCS != undefined)
             jscodetextfieldCS.setText(jscodeCS);
         
         var jscodelst = "notifyAlarm = function(event){  \n"
        	 +"ut(‘send’,’customkey’,’action’,’Alarm button pressed’);\n"
        	 +"}"
         	 var jscodetextfieldlst = this.getView().byId("jsSnippetTextcodelst");
         if (jscodetextfieldlst != undefined)
             jscodetextfieldlst.setText(jscodelst);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf sap.ui.usage.analytics.documentation.TrakingEvents
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf sap.ui.usage.analytics.documentation.TrakingEvents
*/
//	onExit: function() {
//
//	}

});