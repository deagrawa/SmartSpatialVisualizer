jQuery.sap.require("sap.ui.usage.analytics.util.Formatter");
jQuery.sap.require("sap.ui.usage.analytics.util.Controller");

sap.ui.usage.analytics.util.Controller.extend("sap.ui.usage.analytics.view.Detail", {

	onInit : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if (sap.ui.Device.system.phone) {
			// don't wait for the master on a phone
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			// this.getView().setBusy(true);
			this.getEventBus().subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
			this.getEventBus().subscribe("Master", "FirstItemSelected", this.onFirstItemSelected, this);
			sap.ui.getCore().getEventBus().subscribe("Detail", "ProductChanged", this.onDetailChanged, this);
		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "productData");
		var oText = new sap.ui.commons.TextField();

		oText.bindValue("/CUSTOMCOLUMNMETADATA", null, sap.ui.model.BindingMode.OneWay);
		// var o =
		// this.getView().getModel().getData("/CUSTOMCOLUMNMETADATA(" +
		// 'newappdeag52' +")");

		var oModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oModel, "productData");

		var oModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oModel, "customData");

		var oModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oModel, "analyzeData");

	},

	onEdit : function(evt) {

		var id_productPortfolioDetailId1 = this.getView().byId('productPortfolioDetailId1');
		var id_productPortfolioDetailId2 = this.getView().byId('productPortfolioDetailId2');
		var id_productPortfolioDetailId3 = this.getView().byId('productPortfolioDetailId3');
		var id_productAdminstartorDetailId = this.getView().byId('productAdminstartorDetailId');
		var id_productAdminSDetailId = this.getView().byId('productAdminSDetailId');
		var id_productDateDetailId = this.getView().byId('productDateDetailId');
		var id_productInfoDetailId = this.getView().byId('productInfoDetailId');
		var id_productLastMDetailId = this.getView().byId('productLastMDetailId');

		if (evt.getSource().getSrc() === "sap-icon://edit") {
			this.getView().byId('editbuttonid').setSrc("sap-icon://accept");
			id_productPortfolioDetailId1.setEditable(true);
			id_productPortfolioDetailId2.setEditable(true);
			id_productPortfolioDetailId3.setEditable(true);
			id_productAdminstartorDetailId.setEditable(true);
			id_productAdminSDetailId.setEditable(true);
		} else {
			id_productPortfolioDetailId1.setEditable(false);
			id_productPortfolioDetailId2.setEditable(false);
			id_productPortfolioDetailId3.setEditable(false);
			id_productAdminstartorDetailId.setEditable(false);
			id_productAdminSDetailId.setEditable(false);
			this.getView().byId('editbuttonid').setSrc("sap-icon://edit").setTooltip("Edit");

			var data = {};
			data.APPLICATIONID = this.getView().byId('detailProductId')._lastValue;
			data.RESPONSIBLE = this.getView().byId('productAdminstartorDetailId')._lastValue.trim();
			data.RESPONSIBLE_S = this.getView().byId('productAdminSDetailId')._lastValue.trim();
			data.PORTFOLIOLEVEL1 = this.getView().byId('productPortfolioDetailId1')._lastValue.trim();
			data.PORTFOLIOLEVEL2 = this.getView().byId('productPortfolioDetailId2')._lastValue.trim();
			data.PORTFOLIOLEVEL3 = this.getView().byId('productPortfolioDetailId3')._lastValue.trim();
			var doUpdateTo = "/APPLICATION(APPLICATIONID ='" + this._sProductId + "')";
			sap.ui.getCore().getModel().update(doUpdateTo, data, null, $.proxy(this.editSuccess, this),
					$.proxy(this.editFailed, this));

		}
	},

	editSuccess : function() {
		this.getOwnerComponent().messageDisplay("UPDATED ", sap.m.MessageBox.Icon.SUCCESS, "SUCCESS");
		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "sap.ui.usage.analytics.view.AddProduct",
			targetViewType : "XML",
			transition : "slide",
			name : "AddProduct",
		});

	},

	editFailed : function() {
		try {
			if (arguments && arguments.length > 0) {
				var xmlDisplay = arguments[0].response.body;
				var xmlDoc = $.parseXML(xmlDisplay);
				xmlDisplay = $(xmlDoc);
				this.getOwnerComponent().messageDisplay(xmlDisplay.find("message").text(), "Failed");
			}
		} catch (exp) {
			this.getOwnerComponent().messageDisplay("Internal Server Error", "Failed");
		}

		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "sap.ui.usage.analytics.view.AddProduct",
			targetViewType : "XML",
			transition : "slide",
			name : "AddProduct",
		});
	},

	onAfterRendering : function() {
		var labelArray = $('.detaillabelclass');
		for (var i = 0; i < labelArray.length; i++) {
			labelArray[i].setAttribute('class', 'detaillabelclass');
		}
	},

	OnRegenerateView : function() {

		that = this;

		var data = this.getView().getModel().getData("/APPLICATION('" + this._sProductId + "')");

		// var dataPath = this.getView().getModel().getProperty("/APPLICATION('"
		// + this._sProductId + "')");
		var viewStatus = data.IVIEWSTATUS;
		if (viewStatus === "SUCCESS") {
			this.getOwnerComponent().messageDisplay("Views already created.", "Information",
					sap.m.MessageBox.Icon.INFORMATION, sap.m.MessageBox.Action.OK);

		}
		if (viewStatus === "IN PROGRESS") {
			this.getOwnerComponent().messageDisplay("Views creation IN PROGRESS. Wait for sometime.", "Information",
					sap.m.MessageBox.Icon.INFORMATION, sap.m.MessageBox.Action.OK);

		} else if (viewStatus === "FAILED") {
			this.getOwnerComponent().messageDisplay(
					"Do you want to Regenrate Views?",
					"Confirm",
					sap.m.MessageBox.Icon.QUESTION,
					[ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
					function(bResult) {
						var tableCtrl = that.getView().byId('customConfigurationList');
						var viewType = tableCtrl.length > 4 ? "custom" : "withoutcustom";
						if (bResult == "OK") {
							var ajaxLayer = new sap.ui.usage.analytics.util.AjaxServices;
							var serviceParameter = {
								url : "/UsageCloudUI/ViewCreationServlet?appID=" + that._sProductId + "&type="
										+ viewType,
								data : that._sProductId
							};

							var sendData = [];
							sendData = {
								"appID" : that._sProductId
							};
							serviceParameter.data = JSON.stringify(sendData);
							that.getOwnerComponent()
									.sendData(
											sendData,
											"regeneration",
											that.viewGenerationSucceed,
											that.viewGenerationFail,
											"/UsageCloudUI/ViewCreationServlet?appID=" + that._sProductId + "&type="
													+ viewType);
							// ([
							// ajaxLayer.doCallAsync(serviceParameter,
							// null,
							// null, null) ]);
							that.getView().getModel().refresh();

							// sap.ui.getCore().getModel().create('/FORMULAMASTER',
							// {
							// APPLICATIONID : " APPLICATIONID"
							// }, null,
							// $.proxy(that.viewGenerationSucceed,
							// that),
							// $.proxy(that.viewGenerationFail, that));
						}
					});
		}
		// sap.ui.getCore().getModel().create('/FORMULAMASTER', {
		// APPLICATIONID : " APPLICATIONID"
		// }, null, this.productSaveSucceed, this.productSaveFail);
	},

	onProductEditBtn : function() {
		sData = this.getView().getModel().getData().DataArray;
		var pathId = "";
		for (var i = 0; i < sData.length; i++) {
			if (sData[i].applicationid == this._sProductId) {
				pathId = i;
				break;
			}
		}

		var sProductPath = "/DataArray/" + pathId;

		var prodData = this.getView().getModel().getProperty(sProductPath);

		this.getRouter().myNavToWithoutHash({
			// this.getRouter().navTo("addProduct",{
			applicationid : "addProduct",
			product : "addProduct",
			from : "detail",
			currentView : this.getView(),
			targetViewName : "sap.ui.usage.analytics.view.AddProduct",
			targetViewType : "XML",
			transition : "slide"
		});

		sap.ui.getCore().getEventBus().publish("Master", "ProductEdit", prodData);
	},

	onMasterLoaded : function() {
		// this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
	},

	onFirstItemSelected : function(sChannel, sEvent, oListItem) {
		this.bindView(oListItem.getBindingContext().getPath());
	},

	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();

		// jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function
		// () {
		var oView = this.getView();

		// when detail navigation occurs, update the binding context
		if (oParameters.name !== "product") {
			return;
		}

		this._sProductId = oParameters.arguments.product;
		// this.productName = oParameters.arguments.name;
		var sProductPath = "/APPLICATION('" + this._sProductId + "')";
		this.bindView(sProductPath);
	},

	onDetailChanged : function(oChannel, oCaller, oData) {
		this._sProductId = oData.APPLICATIONID;
		this.sProductName = oData.PRODUCTNAME;
		debugger;


		var query = "/APPLICATION('" + this._sProductId + "')";
		var appData = this.getOwnerComponent().oDataService('read', query);

		this.getView().getModel('productData').setData(appData);
		this.getView().getModel('productData').refresh();

		var query = {
				"url" : "CUSTOMCOLUMNMETADATA/?$format=json&$filter=APPLICATIONID eq '"
					+ encodeURIComponent(this._sProductId) + "'",
					"type" : "GET"
		}
		
		var customData = this.getOwnerComponent().oDataService("filter", query, this, null, query);
		if(customData && customData.length>0 && customData[0].d && customData[0].d.results){
			this.getView().getModel('customData').setData(customData[0].d);
		}
		this.getView().getModel('customData').refresh();

		this.setAppStatus();
		var sProductPath = "/APPLICATION('" + this._sProductId + "')";
		// this.getView().byId('iconTabBarId').setSelectedKey('summaryKey');
		this.bindView(sProductPath);
		if (this.getView().byId('iconTabBarId').getSelectedKey() != 'summaryKey') {
			this.getView().byId('iconTabBarId').setSelectedKey('summaryKey');
		}

	},

	bindView : function(sProductPath) {
//		var oView = this.getView();
//		oView.bindElement(sProductPath);
//
		var hList = this.getView().byId("detailheirarchylistid");
//		var configTable = this.getView().byId("customConfigurationList");
//
		var listBinding = hList.getBinding("items");
//		var tableBinding = configTable.getBinding("items");
//
		var oFilter1 = new sap.ui.model.Filter("APPLICATIONID", sap.ui.model.FilterOperator.EQ, this._sProductId);
		var oFilter2 = new sap.ui.model.Filter("HIERARCHYLEVEL", sap.ui.model.FilterOperator.EQ, '1');
		if (listBinding) {
			var output1 = listBinding.filter([ oFilter1, oFilter2 ]);
		}
//
//		if (tableBinding) {
//			var output2 = tableBinding.filter([ oFilter1 ]);
//		}

		this.getOwnerComponent().sendUsageTracking('{"View":"Registration","Action":"ProductSumary"}');

	},

	viewGenerationSucceed : function() {
		arguments[1].messageDisplay("View Regeneration Successful", "Success", sap.m.MessageBox.Icon.SUCCESS);
	},

	viewGenerationFail : function() {
		arguments[1].messageDisplay(arguments[0]);
	},

	getOwnerComponent : function() {
		var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
		if (v === undefined) {
			return undefined
		}
		return sap.ui.component(v);
	},

	showEmptyView : function() {
		this.getRouter().myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "sap.ui.usage.analytics.view.NotFound",
			targetViewType : "XML"
		});
	},

	onEditPress : function(oEvent) {
		var selectedObject = oEvent.getSource().getBindingContext().getObject();
	},

	onDeletePress : function(oEvent) {
		var selectedObject = oEvent.getSource().getBindingContext();
		this.getView().byId("lineItemList").removeItem(0);
	},

	OnRowChanged : function(oControlEvent) {

		oControlEvent.oSource.getBindingContext().getObject();
		console.log("row changed");
	},

	fireDetailChanged : function(sProductPath) {
		this.getEventBus().publish("Detail", "Changed", {
			sProductPath : sProductPath
		});
	},

	fireDetailNotFound : function() {
		this.getEventBus().publish("Detail", "NotFound");
	},

	onNavBack : function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onTabBarSelect : function(oEvent) {
		var oSource = oEvent.getSource().getParent();
		if (oEvent.getParameter("key") == "analysisKey") {
			var url = "ViewCreationServlet?storyType=CustomStories&productName=" + this.sProductName + "&userName="
					+ this.getOwnerComponent().getUser();
			var stories = this.getOwnerComponent().sendData("data", "action", null, null, url, "GET");
			if (stories && stories.length > 0) {
				this.getView().getModel("analyzeData").setData(stories[0]);
				this.getView().getModel("analyzeData").refresh();
			}
		}
		// var oSource = oEvent.getSource().getParent();
		// if (oEvent.getParameter("key") == "analysisKey") {
		// var analysisView = sap.ui.view({
		// viewName : "sap.ui.usage.analytics.view.Analysis",
		// type : sap.ui.core.mvc.ViewType.XML
		// });
		//
		// // oSource.addContent(analysisView);
		// this.getView().byId('iconpage2').addContent(analysisView);
		// }

	},

	onRefreshButtonPress : function() {
		var url = "ViewCreationServlet?storyType=CustomStories&productName=" + this.sProductName + "&userName="
				+ this.getOwnerComponent().getUser();
		var serviceData = {
			"url" : url,
			"type" : "GET",
			"data" : "data"
		};
		var stories = this.getOwnerComponent().sendData(serviceData);

		if (stories && stories.length > 0) {
			this.getView().getModel("analyzeData").setData(stories[0]);
			this.getView().getModel("analyzeData").refresh();
		}
		this.getView().byId("refreshId").setPressed(false);
	},
	createNewStoryBoard : function() {
		window.open(this.getOwnerComponent().getProperties().oData.lumiraServerUrl, '_blank');
	},
	showStoryBoard : function(e) {
		if (!this.dialog) {
			this.dialog = sap.ui.xmlfragment("sap.ui.usage.analytics.view.StoryBoard", this // associate
			// controller
			// with
			// the
			// fragment
			);

			this.getView().addDependent(this.dialog);

		}

		this.dialog.bindElement("analyzeData>Stories/0");
		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.dialog);
		var id;
		var storyName = "";
		if (e.getSource().sId.match("listm") && e.getSource().sId.match("listm").length > 0) {
			id = e.getSource().getSelectedItem().getBindingContext("analyzeData").getObject().UUID;
			storyName = e.getSource().getSelectedItem().getBindingContext("analyzeData").getObject().ITEM_NAME
			this.getView().byId("listm").removeSelections();
		} else {
			id = e.getSource().getBindingContext("analyzeData").getObject().UUID;
			storyName = e.getSource().getBindingContext("analyzeData").getObject().ITEM_NAME;
			this.getView().byId("listm").removeSelections();
		}

		this.dialog.open();
		$('#storyFrame').height($('#storyFrame').parent().parent().height() * 0.95);

		var url = this.getOwnerComponent().getProperties().oData.lumiraServerUrl;

		$('#storyFrame').width($('#storyFrame').parent().width() * 0.99);
		$("#storyFrame").attr("src", url + "open?id=" + id + "&type=HANALYTIC");

		$('#sbDialog-lbl').text(storyName);
		this.getView().byId("listm").removeSelections();
	},

	showListView : function() {
		this.getView().byId("tilem").setVisible(false);
		this.getView().byId("listm").setVisible(true);
		this.getView().byId("listsbBtn").setPressed(true);
		this.getView().byId("gridsbBtn").setPressed(false);
	},

	showGridView : function() {
		this.getView().byId("listm").setVisible(false);
		this.getView().byId("tilem").setVisible(true);
		this.getView().byId("listsbBtn").setPressed(false);
		this.getView().byId("gridsbBtn").setPressed(true);
	},

	onDetailSelect : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("product", {
			product : this._sProductId,
			tab : oEvent.getParameter("selectedKey")
		}, true);
	},

	usageTrackingUpdateSuccess : function() {
		var switchControl = this.getView().byId("switchid");
		var prodstate = switchControl.getState();
		var status = (prodstate == "1") ? "Enabled" : "Disabled";
		this.getOwnerComponent().messageDisplay("Product Monitoring " + status, sap.m.MessageBox.Icon.SUCCESS,
				"SUCCESS");
	},

	usageTrackingUpdateFailed : function() {
		try {
			if (arguments && arguments.length > 0) {
				var xmlDisplay = arguments[0].response.body;
				var xmlDoc = $.parseXML(xmlDisplay);
				xmlDisplay = $(xmlDoc);
				this.getOwnerComponent().messageDisplay(xmlDisplay.find("message").text(), "Failed");
			}
		} catch (exp) {

			this.getOwnerComponent().messageDisplay("Internal Server Error", "Failed");
		}
	},

	onProductMonitoringEnable : function(oEvent) {
		var switchControl = this.getView().byId("switchid");
		var productstate = 1;
		if (switchControl) {
			productstate = switchControl.getState() ? 1 : 0;
		}

		var data = {};
		data.APPLICATIONID = this._sProductId
		data.APPLICATIONSTATUS = productstate;

		var doUpdateTo = "/APPLICATION(APPLICATIONID ='" + this._sProductId + "')";
		sap.ui.getCore().getModel().update(doUpdateTo, data, null, $.proxy(this.usageTrackingUpdateSuccess, this),
				$.proxy(this.usageTrackingUpdateFailed, this));
		sap.ui.getCore().getModel().refresh();

	},

	setAppStatus : function() {
		var filterData = "/APPLICATION('" + this._sProductId + "')";
		var app_status = sap.ui.getCore().getModel().getData(filterData).APPLICATIONSTATUS;
		if (app_status === "1") {
			this.getView().byId("switchid").setState(true);
		} else {
			this.getView().byId("switchid").setState(false);
		}
	},

	onProductDeleteBtn : function(oEvent) {
		var change = this.getView().byId('productNameDetailId').getValue();
		var name = "Product( " + " " + change + " " + ")Deleted";
		var data = {};
		data.APPLICATIONID = this._sProductId
		var that = this;
		var doDelete = "/APPLICATION(APPLICATIONID ='" + this._sProductId + "')";
		that.getOwnerComponent().messageDialog(
				"Do you want to delete this product",
				"Confirm",
				sap.m.MessageBox.Icon.QUESTION,
				[ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				function(bResult) {

					if (bResult == "OK") {
						sap.ui.getCore().getModel().remove(
								doDelete,
								null,
								function() {
									that.getOwnerComponent().messageDisplay(name + status, "Success",
											sap.m.MessageBox.Icon.SUCCESS);
								},
								function() {
									try {
										if (arguments && arguments.length > 0) {
											var xmlDisplay = arguments[0].response.body;
											var xmlDoc = $.parseXML(xmlDisplay);
											xmlDisplay = $(xmlDoc);
											that.getOwnerComponent().messageDisplay(xmlDisplay.find("message").text(),
													"Failed");
										}
									} catch (exp) {

										that.getOwnerComponent().messageDisplay("Internal Server Error", "Failed");
									}

								});

						sap.ui.getCore().getModel().refresh();
						that.getRouter().myNavToWithoutHash({
							// this.getRouter().navTo("addProduct",{
							applicationid : "addProduct",
							product : "addProduct",
							from : "detail",
							currentView : that.getView(),
							targetViewName : "sap.ui.usage.analytics.view.AddProduct",
							targetViewType : "XML",
							transition : "slide"

						});
					} else
						return;

				});

	},

});
