sap.ui
		.controller(
				"sap.ui.usage.analytics.documentation.PPInfo",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf sap.ui.usage.analytics.documentation.PPInfo
					 */
					// onInit: function() {
					//
					// },
					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf sap.ui.usage.analytics.documentation.PPInfo
					 */
					onBeforeRendering : function() {
						var jscode = "var instance = {}; \n" + "instance.applicationid	= 'ap1'; \n"
								+ " instance.productname	= 'pc1';" + "instance.productversion	= '12.04.1.3'; \n"
								+ "instance.productpatch	= '0.01'; \n"
								+ "instance.installationid	= 'installation101'; \n"
								+ "ut(‘config’,’geolocation’,’on’)\n" + "ut('create',JSON.stringify(instance));\n"
						var jscodetextfield = this.getView().byId("jsSnippetTextcode");
						if (jscodetextfield != undefined)
							jscodetextfield.setText(jscode);

						var jscodeone = "var instance = {}; \n" + "instance.applicationid	= 'ap1'; \n"
								+ " instance.productname	= 'pc1';" + "instance.productversion	= '12.04.1.3'; \n"
								+ "instance.productpatch	= '0.01'; \n"
								+ "instance.installationid	= 'installation101'; \n"
								+ "ut(‘config’,’geolocation’,’off’)\n" + "ut('create',JSON.stringify(instance));\n"
						var jscodetextfieldone = this.getView().byId("jsSnippetTextcodeone");
						if (jscodetextfieldone != undefined)
							jscodetextfieldone.setText(jscodeone);

						var jscodecolone = "Now, the client SDK sends a GET request to the Usage Cloud tool using ‘q=permissionLevel’query’. When the client SDK receives the ‘{"
								+ +"\"permission:\"all\"}’response it enables tracking. When the client SDK receives ‘{\"permission\":\"none\"}’ response it disables tracking."
						var jscodetextfieldcolone = this.getView().byId("jsSnippetTextcodecolone");
						if (jscodetextfieldcolone != undefined)
							jscodetextfieldcolone.setText(jscodecolone);

						var jscodecoltwo = "Now, the client SDK sends a GET request to the Usage Cloud tool using the 'q=nonPersonalKeys'. The client SDK receives the ‘{\"permission\":\"non-personal\",\"keys\":[< list of non-personal keys>]}’response from the Usage Cloud tool once it enables tracking for your application."
								+ "Note: \":[< list of non-personal keys>]}’ denotes the keys that are present in non-personal information; the remaining keys are removed from the POST payload corresponding to the data collection.\""
						var jscodetextfieldcoltwo = this.getView().byId("jsSnippetTextcodecoltwo");
						if (jscodetextfieldcoltwo != undefined)
							jscodetextfieldcoltwo.setText(jscodecoltwo);

						var jscodelst = "function notify(data){\n"
								+ "console.log(data);\n"
								+ "}"
						var jscodetextfieldlst = this.getView().byId("jsSnippetTextcodelst");
						if (jscodetextfieldlst != undefined)
							jscodetextfieldlst.setText(jscodelst);
					},

				/**
				 * Called when the View has been rendered (so its HTML is part
				 * of the document). Post-rendering manipulations of the HTML
				 * could be done here. This hook is the same one that SAPUI5
				 * controls get after being rendered.
				 * 
				 * @memberOf sap.ui.usage.analytics.documentation.PPInfo
				 */
				// onAfterRendering: function() {
				//
				// },
				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf sap.ui.usage.analytics.documentation.PPInfo
				 */
				// onExit: function() {
				//
				// }
				});