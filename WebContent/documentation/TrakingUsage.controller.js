sap.ui.controller("sap.ui.usage.analytics.documentation.TrakingUsage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sap.ui.usage.analytics.documentation.TrakingUsage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf sap.ui.usage.analytics.documentation.TrakingUsage
*/
	onBeforeRendering: function() {
		  var jscode = "(function (e, d, t, p, h, n, l) { \n"
              + "  e['UsageTrackingObject'] = h; \n"
              + " var obj={}; \n"
              + "var objGlobal={}; \n"
              + "objGlobal[\"type\"]=\"window\"; \n"
              + "e[h] = e[h] || function () { \n"
              + "(e[h].q = e[h].q || []).push(arguments);\n"
              + "if(window.event){\n"
              + "obj[\"Type\"]=window.event.type;\n"
              + "obj[\"SubClass\"]=window.event.toString().substring(8,window.event.toString().length-1);\n"
              + "obj[\"tagName\"]=window.event.target?window.event.target.tagName:window.event.srcElement.tagName;\n"
              + "obj[\"className\"]=window.event.target?window.event.target.className:window.event.srcElement.className;\n"
              + "(e[h].eventsq = e[h].eventsq || []).push(obj);\n" + "}\n" + "else\n"
              + "(e[h].eventsq = e[h].eventsq || []).push(objGlobal);\n" + "},\n" + "e[h].l = 1 * new Date();\n"
              + "if (typeof(e[h].set) == 'undefined') {\n" + "loadjs();\n" + "}\n" + "function loadjs() {\n"
              + "n = d.createElement(t);\n" + "n.async = 1;\n"
              + "var u = ((\"https:\" == d.location.protocol) ? \"https\" : \"http\") + p;\n" + "n.src = u;\n"
              + "l = d.getElementsByTagName(t)[0];\n" + "l.parentNode.insertBefore(n, l);\n" + "}\n"
              + "})(window, document, 'script','/path/to/ut.js', 'ut');"
          var jscodetextfield = this.getView().byId("jsSnippetTextcode");
          if (jscodetextfield != undefined)
              jscodetextfield.setText(jscode);
          
          var jscodeone = "var instance = {}; \n"
        	  +"instance.applicationid	= \"ap1\"; \n"
        	  +"instance.productname	= \"pc1\"; \n"
        	  +"instance.productversion	= \"12.04.1.3\"; \n"
        	  +"instance.productpatch	= \"0.01\"; \n"
        	  +"instance.installationid	= \"installation101\"; \n"
        	  +"ut('create',JSON.stringify(instance));"
        var jscodetextfieldone = this.getView().byId("jsSnippetTextcodeone");
          if(jscodetextfieldone != undefined )
        	  jscodetextfieldone.setText(jscodeone);
          
          var jscodetwo = "Now, the client SDK sends a GET request to the Usage Cloud tool using ‘q=permissionLevel’query’. The client SDK receives the ‘{\"permission\":\"all\"}’response from the Cloud Usage tool after it enables application tracking. \n"
        	  +"Note: \n"
        	  +"Client SDK receives' {\"permission\”: \"all\"}' response depending on the privacy settings of the organization. \n"
        	  +"• If the organization enables application tracking, then client SKD receives ‘{\"permission\":\"all\"}' response. \n"
        	  +"• If the organization disables application tracking, then client SKD receives ‘{\"permission\":\"none\"}'response. \n"
        	  +"• Organizational preference overwrites clients’ preference."
        var jscodetextfieldtwo = this.getView().byId("jsSnippetTextcodetwo");
          if(jscodetextfieldtwo != undefined )
        	  jscodetextfieldtwo.setText(jscodetwo);
          
          var jscodethree = "var instance = {}; \n"
        	  +"instance.applicationid	= \"ap1\"; \n"
        	  +"instance.productname	= \"pc1\"; \n"
        	  +"instance.productversion	= \"12.04.1.3\"; \n"
        	  +"instance.productpatch	= \"0.01\"; \n"
        	  +"instance.installationid	= \"installation101\"; \n"
        	  +"var configInfo = {}; \n"
        	  +"configInfo.tracking= \"on\"; \n"
        	  +"instance.config=configInfo; \n"
        	  +"ut('create',JSON.stringify(instance));"
        var jscodetextfieldthree = this.getView().byId("jsSnippetTextcodethree");
          if(jscodetextfieldthree != undefined )
        	  jscodetextfieldthree.setText(jscodethree);

	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf sap.ui.usage.analytics.documentation.TrakingUsage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf sap.ui.usage.analytics.documentation.TrakingUsage
*/
//	onExit: function() {
//
//	}

});