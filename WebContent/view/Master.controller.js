jQuery.sap.require("sap.ui.usage.analytics.util.Formatter");
jQuery.sap.require("sap.ui.usage.analytics.util.Controller");

sap.ui.usage.analytics.util.Controller.extend("sap.ui.usage.analytics.view.Master", {

	onInit : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		var oEventBus = this.getEventBus();
		this.getView().byId("list").attachEventOnce("updateFinished", function() {
			this.oInitialLoadFinishedDeferred.resolve();
			oEventBus.publish("Master", "InitialLoadFinished");
		}, this);

		// tbr
		this.oInitialLoadFinishedDeferred.resolve();

		oEventBus.subscribe("Detail", "TabChanged", this.onDetailTabChanged, this);
		sap.ui.getCore().getEventBus().subscribe("Detail", "ProductAdded", this.productAdded, this);
		sap.ui.getCore().getEventBus().subscribe("Detail", "DisableMasterView", this.disableMasterView, this);

		// on phones, we will not have to select anything in the
		// list so we don't need to attach to events
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

		oEventBus.subscribe("Detail", "Changed", this.onDetailChanged, this);
		oEventBus.subscribe("Detail", "NotFound", this.onNotFound, this);

		var oModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oModel, "analyzeData");
	},

	disableMasterView : function(sChanel, sEvent, productData) {
		// try to overlay here for disabling master view
	},

	productAdded : function(sChanel, sEvent, productData) {
		var oModel = this.getView().getModel();
		var data = oModel.getData().DataArray;
		if (data) {
			data.push(productData);
		} else { // else condition in case DataArray in not intialized and
			// users adds product, ideally it shouldn;t go inside else
			// condition
			oModel.getData().DataArray = [];
			oModel.getData().DataArray.push(productData);
		}

		oModel.refresh();
	},

	onCommonStoriesSelect : function() {
		this.getRouter().myNavToWithoutHash({
			from : "detail",
			currentView : this.getView(),
			targetViewName : "sap.ui.usage.analytics.view.CommonStories",
			targetViewType : "XML",
			transition : "slide"
		});

		var url = "ViewCreationServlet?storyType=CommonStories" + "&userName=" + this.getOwnerComponent().getUser();
		
		var serviceData = {
			"url" : url,
			"type" : "GET",
			"data": "data"
		}
		
		var stories = this.getOwnerComponent().sendData(serviceData);
		
//		var stories = this.getOwnerComponent().sendData("data", "action", null, null, url, "GET");
		sap.ui.getCore().getEventBus().publish("Detail", "CommonStories", stories);

		// if (stories && stories.length > 0) {
		// this.getView().getModel("analyzeData").setData(stories[0]);
		// this.getView().getModel("analyzeData").refresh();
		// }

	},

	onRouteMatched : function(oEvent) {
		var sName = oEvent.getParameter("name");

		if (sName !== "product1") {
			return;
		}

		// condition to check if any items are registered or not
		var oList = this.getView().byId("list");
		var aItems = oList.getItems();
		if (aItems.length) {
			// Load the detail view in desktop
			this.getRouter().myNavToWithoutHash({
				currentView : this.getView(),
				targetViewName : "sap.ui.usage.analytics.view.Detail",
				targetViewType : "XML"
			});

			// Wait for the list to be loaded once
			this.waitForInitialListLoading(function() {

				// On the empty hash select the first item
				var oFirstItem = this.selectFirstItem();

				this.getEventBus().publish("Master", "FirstItemSelected", oFirstItem);
			});
		} else {
			// this.getRouter().myNavToWithoutHash({
			// this.getRouter().navTo("AddProduct", {
			this.getRouter().myNavToWithoutHash({
				applicationid : "AddProduct",
				product : "AddProduct",
				from : "detail",
				currentView : this.getView(),
				targetViewName : "sap.ui.usage.analytics.view.AddProduct",
				targetViewType : "XML",
				transition : "slide"
			});
		}
	},

	onDetailChanged : function(sChanel, sEvent, oData) {
		var sProductPath = oData.sProductPath;
		// Wait for the list to be loaded once
		this.waitForInitialListLoading(function() {
			var oList = this.getView().byId("list");

			var oSelectedItem = oList.getSelectedItem();
			// the correct item is already selected
			if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sProductPath) {
				return;
			}

			var aItems = oList.getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getBindingContext().getPath() === sProductPath) {
					oList.setSelectedItem(aItems[i], true);
					break;
				}
			}
		});
	},

	onDetailTabChanged : function(sChanel, sEvent, oData) {
		this.sTab = oData.sTabKey;
	},

	waitForInitialListLoading : function(fnToExecute) {
		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
	},

	onNotFound : function() {
		this.getView().byId("list").removeSelections();
	},

	selectFirstItem : function() {
		var oList = this.getView().byId("list");
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
			return aItems[0];
		}
	},

	getOwnerComponent : function() {
		var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
		if (v === undefined) {
			return undefined
		}
		return sap.ui.component(v);
	},

	onSearch : function() {
		this.getOwnerComponent().sendUsageTracking('{"View":"Registration","Action":"Product Search"}');
		var searchString = this.getView().byId("searchField").getValue().toUpperCase();
		if (searchString == "") {

			var list2 = this.getView().byId("list");
			var binding1 = list2.getBinding("items");
			var oFilter_responsible = new sap.ui.model.Filter("RESPONSIBLE", sap.ui.model.FilterOperator.EQ, this
					.getOwnerComponent().user);
			/*
			 * var oFilter_responsible_s = new
			 * sap.ui.model.Filter("RESPONSIBLE_S",
			 * sap.ui.model.FilterOperator.EQ, this .getOwnerComponent().user);
			 * var oFilter_product = new sap.ui.model.Filter("PRODUCTNAME",
			 * sap.ui.model.FilterOperator.Contains,searchString); var
			 * allfilter1 = new sap.ui.model.Filter([oFilter_responsible]
			 * ,true);
			 */
			binding1.filter(oFilter_responsible);

		} else {
			var list2 = this.getView().byId("list");
			var binding1 = list2.getBinding("items");
			var oFilter_responsible = new sap.ui.model.Filter("RESPONSIBLE", sap.ui.model.FilterOperator.EQ, this
					.getOwnerComponent().user);
			var oFilter_responsible_s = new sap.ui.model.Filter("RESPONSIBLE_S", sap.ui.model.FilterOperator.EQ, this
					.getOwnerComponent().user);
			var oFilter_product = new sap.ui.model.Filter("toupper(PRODUCTNAME)", sap.ui.model.FilterOperator.Contains,
					searchString);
			var allfilter1 = new sap.ui.model.Filter([ oFilter_product, oFilter_responsible ], true);
			binding1.filter(allfilter1);
		}

	},

	onSelect : function(oEvent) {
		this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},

	showDetail : function(oItem) {
		// If we're on a phone, include nav in history; if not,
		// don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		
		var req = new XMLHttpRequest();
		req.open('GET', document.location, false);
		req.send(null);
		var sessionInfo = req.getResponseHeader ("com.sap.cloud.security.login");
		if (sessionInfo && sessionInfo.toLowerCase()=== "login-request") {
			alert("Session is expired, page shall be reloaded.");
			window.location.reload();
		}
		
		this.getView().byId("addNewBtn").removeStyleClass("addButtonBackgroundClass");

		var productInfo = oItem.getBindingContext().getProperty();
		// var iProductId =
		// oItem.getBindingContext().getProperty("APPLICATIONID");
		// var iProductName =
		// oItem.getBindingContext().getProperty("PRODUCTNAME");

		// this.getRouter().navTo("product", {
		this.getRouter().myNavToWithoutHash({
			from : "master",
			product : productInfo.APPLICATIONID,
			currentView : this.getView(),
			targetViewType : "XML",
			targetViewName : "sap.ui.usage.analytics.view.Detail",
			transition : "slide"
		// tab : this.sTab || "product"
		}, bReplace);

		sap.ui.getCore().getEventBus().publish("Detail", "ProductChanged", productInfo);
	},

	onAddProduct : function() {
		this.getView().byId("addNewBtn").addStyleClass("addButtonBackgroundClass");
		this.getView().byId("list").removeSelections();
		// this.getView().byId("list").setSelectedItemById("-1");
		sap.ui.getCore().getEventBus().publish("Master", "AddProductInitialLoad");

		this.getRouter().myNavToWithoutHash({
			// this.getRouter().navTo("AddProduct", {
			applicationid : "AddProduct",
			product : "AddProduct",
			from : "detail",
			currentView : this.getView(),
			targetViewName : "sap.ui.usage.analytics.view.AddProduct",
			targetViewType : "XML",
			transition : "slide"
		}, false);

	},

	onAfterRendering : function() {
		var list = this.getView().byId("list");

		var binding = list.getBinding("items");

		var oFilter1 = new sap.ui.model.Filter("RESPONSIBLE", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent()
				.getUser());
		var oFilter2 = new sap.ui.model.Filter("RESPONSIBLE_S", sap.ui.model.FilterOperator.EQ, this
				.getOwnerComponent().getUser());

		var allfilter = new sap.ui.model.Filter([ oFilter1, oFilter2 ], false);
		binding.filter(allfilter);

		this.getRouter().myNavToWithoutHash({
			// this.getRouter().navTo("AddProduct", {
			applicationid : "AddProduct",
			product : "AddProduct",
			from : "detail",
			currentView : this.getView(),
			targetViewName : "sap.ui.usage.analytics.view.AddProduct",
			targetViewType : "XML",
			transition : "slide"
		}, false);
	},

	sdf : function(f, s) {
		if (!f) {
			f = []
		}
		if (f instanceof sap.ui.model.Filter) {
			f = [ f ]
		}
		if (s == F.Application) {
			this.aApplicationFilters = f
		} else {
			this.aFilters = f
		}
		f = this.aFilters.concat(this.aApplicationFilters);
		if (!f || !q.isArray(f) || f.length == 0) {
			this.aFilters = [];
			this.aApplicationFilters = []
		}
		this.createFilterParams(f);
		this.abortPendingRequest();
		this.resetData();
		if (this.bInitialized) {
			if (this.oRequestHandle) {
				this.oRequestHandle.abort();
				this.oRequestHandle = null;
				this.bPendingRequest = false
			}
			this.sChangeReason = sap.ui.model.ChangeReason.Filter;
			this._fireRefresh({
				reason : this.sChangeReason
			});
			if (s == F.Application) {
				this._fireFilter({
					filters : this.aApplicationFilters
				})
			} else {
				this._fireFilter({
					filters : this.aFilters
				})
			}
		}
		return this
	}

});