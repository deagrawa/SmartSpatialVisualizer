sap.ui.controller("sap.ui.usage.analytics.documentation.APIFaq", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sap.ui.usage.analytics.documentation.APIFaq
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf sap.ui.usage.analytics.documentation.APIFaq
*/
	onBeforeRendering: function() {
		 var jscode = "var instance = {}; \n"
             + "instance.applicationid	= 'ap1'; \n"
             + " instance.productname	= 'pc1';"
             + "instance.productversion	= '12.04.1.3'; \n"
             + "instance.productpatch	= '0.01'; \n"
             + "instance.installationid	= 'installation101'; \n"
             + " ut(‘config’,’browsersessionid’,<value of browsersessionid in string format>)\n"
             + "ut('create',JSON.stringify(instance))\n"
         var jscodetextfield = this.getView().byId("jsSnippetTextcode");
         if (jscodetextfield != undefined)
             jscodetextfield.setText(jscode);
         
         var jscodeone = "var instance = {}; \n"
             + "instance.applicationid	= 'ap1'; \n"
             + " instance.productname	= 'pc1';"
             + "instance.productversion	= '12.04.1.3'; \n"
             + "instance.productpatch	= '0.01'; \n"
             + "instance.installationid	= 'installation101'; \n"
             + "var config = {};\n"
             + "config.tracking = 'on';\n"
             + "config.geolocation = 'on';\n"
             + "config.browsersessionid = 'examplebrwsersessionid';\n"
             + "instance.configInfo = config;\n"
             + "ut('create',JSON.stringify(instance));\n"
         var jscodetextfieldone = this.getView().byId("jsSnippetTextcodeone");
         if (jscodetextfieldone != undefined)
             jscodetextfieldone.setText(jscodeone);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf sap.ui.usage.analytics.documentation.APIFaq
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf sap.ui.usage.analytics.documentation.APIFaq
*/
//	onExit: function() {
//
//	}

});