sap.ui.controller("sap.ui.usage.analytics.documentation.HTTPClient", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf documentation.HTTPClient
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf documentation.HTTPClient
*/
	onBeforeRendering: function() {
		var jscode = "{ \n"
            + "'Events': [ \n"
            + " { \n"
            + "'applicationid': 'ap1', \n"
            + "'recordgroupid': 'rg1', \n"
            + "'productname': 'pc1', \n"
            + "'productversion': '12.04.1.3',\n"
            + "'productpatch': '0.01',\n"
            + "'geolocation1': '7890',\n"
            + "'geolocation2': '6789',\n"
            + "'tstamp': '2014-12-19 12:12:12.234',\n"
            + "'country': 'mangolia',\n"
            + "'region': 'Karnataka',\n"
            + "'city': 'Bengaluru',\n"
            + "'installationid': 'id1',\n"
            + "'operatingsystem': 'Windows',\n"
            + "'osversion': '7.1',\n"
            + "'browsername': 'Chrome',\n"
            + "'browserversion': '12.34',\n"
            + "'browsersessionid': 'dhkfjf',\n"
            + "'eventsList': [\n"
            + "{\n"
            + "'customkey1': 'example string 1',\n"
            + "'auto1': 'val2'\n"
            + "},\n"
            + " {\n"
            + "'customkey1': 'example string 2',\n"
            + "'auto1': 'val2',\n"
            + " 'customkey3': 'val3'\n"
            + "}\n"
            + " ]"
        var jscodetextfield = this.getView().byId("jsSnippetTextcodeTE");
        if (jscodetextfield != undefined)
            jscodetextfield.setText(jscode);
        
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf documentation.HTTPClient
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf documentation.HTTPClient
*/
//	onExit: function() {
//
//	}

});