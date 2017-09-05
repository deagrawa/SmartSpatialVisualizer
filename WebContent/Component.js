jQuery.sap.declare("sap.ui.usage.analytics.Component");
jQuery.sap.require("sap.ui.usage.analytics.MyRouter");

sap.ui.core.UIComponent.extend("sap.ui.usage.analytics.Component", {
	metadata : {
		name : "Usage Cloud UI",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : [ "sap.m", "sap.ui.layout" ],
			components : []
		},

		rootView : "sap.ui.usage.analytics.view.App",

		config : {
			resourceBundle : "i18n/messageBundle.properties",

		},

		routing : {
			config : {
				routerClass : sap.ui.usage.analytics.MyRouter,
				viewType : "XML",
				viewPath : "sap.ui.usage.analytics.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "main",
				view : "Master",
				targetAggregation : "masterPages",
				targetControl : "idAppControl",
				subroutes : [ {
					pattern : "product/{product}/:tab:",
					name : "product",
					view : "Detail"
				}, {
					pattern : "addProduct",
					name : "AddProduct",
					view : "AddProduct"
				}, {
					pattern : "addProduct/{id}/configure",
					name : "productconfigure",
					view : "productconfigure"
				}, {
					pattern : "addProduct/heirarchy",
					name : "productHierarchy",
					view : "productHierarchy"
				},

				]
			}, {
				name : "catchallMaster",
				view : "Master",
				targetAggregation : "masterPages",
				targetControl : "idAppControl",
				subroutes : [ {
					pattern : ":all*:",
					name : "catchallDetail",
					view : "NotFound",
					transition : "show"
				} ]
			} ]
		}
	},

	init : function() {
		jQuery.sap.require("sap.m.MessageBox");
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("sap.ui.usage.analytics");

		this.properties = new sap.ui.model.json.JSONModel();
		
		this.properties.setData({
			"lumiraServerUrl": "https://usagetrackerxfd09ed1d.neo.ondemand.com/sap/bi/launchpad/",
		});

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ oRootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");
		var view = this;
		this.initAJAXCaller();

		var ssoUser = this.sendData({
			randomData : "abc"
		}, "getUser");

		if (ssoUser && ssoUser.length > 0 && ssoUser[0] && ssoUser[0].hasOwnProperty("UserName")) {
			this.setUser(ssoUser[0].UserName);
		} else {
			this.messageDisplay("No user found", "Internal Server Error");
		}

		this.getInitData();
		// this._getMasterData();

		oModel = new sap.ui.model.json.JSONModel(this.oData);

		// set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

		this.getRouter().initialize();

		var oModel = this.getModel();
		if (oModel && oModel.oData.DataArray && oModel.oData.DataArray.length > 0) {
			this.getRouter().navTo("product", {
				from : "master",
				product : oModel.oData.DataArray[oModel.oData.DataArray.length - 1].applicationid,
			// tab : this.sTab || "product"
			});
		} else {

			// this.getRouter().myNavToWithoutHash({
			// // this.getRouter().navTo("addProduct",{
			// applicationid : "AddProduct",
			// product : "AddProduct",
			// // from : "productHierarchy",
			// currentView : this.getView(),
			// targetViewName : "sap.ui.usage.analytics.view.AddProduct",
			// targetViewType : "XML",
			// transition : "slide",
			// name : "AddProduct",
			// });
			//
			this.getRouter().navTo("AddProduct", {
				applicationid : "AddProduct",
				product : "AddProduct",
				from : "detail",
				targetViewName : "sap.ui.usage.analytics.view.AddProduct",
				targetViewType : "XML",
				transition : "slide"
			});
		}
	},

	getProperties: function(){
		return this.properties;
	},
	
	verifyCBoxValues : function(oControl) {
		var listItems = oControl.getItems();
		var currentValue = oControl.getValue();
		var flag = "invalid";

		for (var i = 0; i < listItems.length; i++) {
			if (currentValue == listItems[i].getText()) {
				flag = "valid";
				break;
			}
		}
		if(flag == "invalid"){
			return false;
		}else{

		return true;
		}
	},

	initAJAXCaller : function() {
		jQuery.sap.require("sap.ui.usage.analytics.util.AjaxServices");
		this.ajaxLayer = new sap.ui.usage.analytics.util.AjaxServices;
		this.oData = {};
		this.ajaxLayer.setComponent(this);
	},

	getInitData : function() {
		var selectData = {
			"user" : this.user
		};

		var url = "./example.svc/";

		this.dataTypeData = new sap.ui.model.odata.ODataModel(url);
		// var dataTypeData1 = new sap.ui.model.odata.ODataModel(url +
		// "APPLICATION");
		// var dataTypeData2 = new sap.ui.model.json.JSONModel(url);

		this.dataTypeData.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		this.dataTypeData.setCountSupported(true);
		this.setModel(this.dataTypeData);
		sap.ui.getCore().setModel(this.dataTypeData);
		// var oModel = new sap.ui.model.odata.ODataModel(url, false, "i309309",
		// "1a2b3c4b@D");

		// var result = this.sendData(selectData, "select");
		// this.oData = result[0];
	},

	getModel : function() {
		return this.dataTypeData;
	},

	getUser : function() {
		if (!this.user)
			this.user = "";

		return this.user;
	},

	setUser : function(user) {
		this.user = user;
	},

	sendData : function(serviceParameter, data, action, fSuccess, fFailure, url, type) {
		var parameters = {
			url : serviceParameter.url ? serviceParameter.url : "./SsoAuthServlet/",
		// url :
		// "https://testappx9bc42e6d.neo.ondemand.com/UsageCloudUI/AppDataServlet/",
		// url:
		// "https://deag1x9bc42e6d.neo.ondemand.com/UsageCloudUI/AppDataServlet/",
		// url:
		// "https://test1x9bc42e6d.neo.ondemand.com/UsageCloudUI/AppDataServlet"
		// ,
		// data : ""
		};
		// var sendData = [];
		// var eventData = [ data ];
		// sendData.push({
		// "action" : action,
		// "Events" : eventData
		// });
		// sendData = {
		// "Actions" : sendData
		// };
		// serviceParameter.data = JSON.stringify(sendData);
		parameters.data = data;
		parameters.type = serviceParameter.type ? serviceParameter.type : "POST";
		parameters.async = serviceParameter.async ? serviceParameter.async : false;
		return ([ this.ajaxLayer.doCall(parameters, fSuccess, fFailure) ]);
	},

	messageDisplay : function(message, title, icon, actions, onClose) {
		sap.m.MessageToast.show(message);
	},

	messageDialog : function(message, title, icon, actions, onClose) {
		sap.m.MessageBox.show(message, {
			icon : icon ? icon : sap.m.MessageBox.Icon.ERROR,
			title : title ? title : " ",
			actions : actions ? actions : sap.m.MessageBox.Action.CLOSE,
			onClose : onClose,
			styleClass : "messageboxclass"
		})
	},

	fFailure : function() {
		arguments[1].messageDisplay(arguments[0]);
	},

	showHideMasterPage : function(oControl, bShow) {
		if (!this.splitApp) {
			this.splitApp = this._findSplitApp(oControl);
		} else {
			var mode = this.splitApp.getMode();
			if (bShow) {
				var zeroIndexItem = $('#__xmlview1--list-before');
				zeroIndexItem.removeClass("disableProductClass");
				sap.ui.getCore().getEventBus().publish("Detail", "DisableMasterView", true);
				// this.splitApp.setMode(sap.m.SplitAppMode.ShowHideMode);
			} else {
				var zeroIndexItem = $('#__xmlview1--list-before');
				zeroIndexItem.addClass("disableProductClass");
				sap.ui.getCore().getEventBus().publish("Detail", "DisableMasterView", false);
				// this.splitApp.setMode(sap.m.SplitAppMode.HideMode);
			}
		}
	},

	verfiyCBoxValues : function(oControl) {
		var listItems = oControl.getItems();
		var currentValue = oControl.getValue();

		for (var i = 0; i < listItems.length; i++) {
			if (currentValue != listItems[i].getText()) {
				return false;
			}
		}

		return true;
	},

	_findSplitApp : function(oControl) {
		sAncestorControlName = "idAppControl";

		if (oControl instanceof sap.ui.core.mvc.View && oControl.byId(sAncestorControlName)) {
			return oControl.byId(sAncestorControlName);
		}

		return oControl.getParent() ? this._findSplitApp(oControl.getParent(), sAncestorControlName) : null;
	},

	sendUsageTracking : function(jsonString) {
		if (parent.ut != undefined)
			parent.ut('send', 'customkey', jsonString);
	},

	serverError : function() {
		try {
			if (arguments && arguments.length > 0) {
				var xmlDisplay = arguments[0].response.body;
				var xmlDoc = $.parseXML(xmlDisplay);
				xmlDisplay = $(xmlDoc);
				this.messageDisplay(xmlDisplay.find("message").text(), "Failed");
			}
		} catch (exp) {

			this.messageDisplay("Internal Server Error", "Failed");
		}
	},

	oDataService : function(operation, query, context, fSuccess, fFailure) {
		if (operation == "create") {
			sap.ui.getCore().getModel().create(query.tableName, query.data, null, $.proxy(fSuccess, context),
					fFailure ? $.proxy(fFailure, context) : this.serverError);
			sap.ui.getCore().getModel().refresh();
		} else if (operation == 'update') {
			sap.ui.getCore().getModel().update(query.updateKey, query.data, null, $.proxy(fSuccess, context),
					fFailure ? $.proxy(fFailure, context) : this.serverError);
			sap.ui.getCore().getModel().refresh();
		} else if (operation == 'read') {
			return sap.ui.getCore().getModel().getData(query, null, null, false, $.proxy(fSuccess, context),
					fFailure ? $.proxy(fFailure, context) : this.serverError);
		} else if (operation == 'get') {
			return sap.ui.getCore().getModel().read(query, null, null, false, $.proxy(fSuccess, context),
					fFailure ? $.proxy(fFailure, context) : this.serverError);

		} else if (operation == 'filter') {
			query.url = "example.svc/" + query.url;
			return this.sendData(query, null, null, $.proxy(fSuccess, context), fFailure ? $.proxy(fFailure, context)
					: this.serverError);
		}
	}

});
