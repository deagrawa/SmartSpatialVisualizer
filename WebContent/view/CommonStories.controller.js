sap.ui.controller("sap.ui.usage.analytics.view.CommonStories", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf samplecheck1.CommonStories
	 */
	onInit : function() {
		var oModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oModel, "analyzeData");
		sap.ui.getCore().getEventBus().subscribe("Detail", "CommonStories", this.Init, this);
	},

	Init : function(oChannel, oEevent, stories) {
		if (stories && stories.length > 0) {
			this.getView().getModel("analyzeData").setData(stories[0]);
			this.getView().getModel("analyzeData").refresh();
		}
	},
	getOwnerComponent : function() {
		var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
		if (v === undefined) {
			return undefined
		}
		return sap.ui.component(v);
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf samplecheck1.CommonStories
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf samplecheck1.CommonStories
	 */
	// onAfterRendering: function() {
	//
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf samplecheck1.CommonStories
	 */
	// onExit: function() {
	//
	// }
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
			this.getView().byId("listm1").removeSelections();
		} else {
			id = e.getSource().getBindingContext("analyzeData").getObject().UUID;
			storyName = e.getSource().getBindingContext("analyzeData").getObject().ITEM_NAME;
			this.getView().byId("listm1").removeSelections();
		}

		this.dialog.open();
		$('#storyFrame').height($('#storyFrame').parent().parent().height() * 0.95);

		$('#storyFrame').width($('#storyFrame').parent().width() * 0.99);
		
		var url = this.getOwnerComponent().getProperties().oData.lumiraServerUrl;
		
		$("#storyFrame").attr("src",
				url + "open?id=" + id + "&type=HANALYTIC");

		$('#sbDialog-lbl').text(storyName);
		this.getView().byId("listm").removeSelections();
	},

	showListView : function() {
		this.getView().byId("tilem1").setVisible(false);
		this.getView().byId("listm1").setVisible(true);
		this.getView().byId("listsbBtn1").setPressed(true);
		this.getView().byId("gridsbBtn1").setPressed(false);
	},
	refreshPress : function() {
		var url = "ViewCreationServlet?storyType=CommonStories" + "&userName=" + this.getOwnerComponent().getUser();
		var serviceData = {
			"url" : url,
			"type" : "GET",
			"data" : "data"
		};

		var stories = this.getOwnerComponent().sendData(serviceData);
		this.getView().byId("refreshCommonId").setPressed(false);
		// sap.ui.getCore().getEventBus().publish("Detail", "CommonStories",
		// stories);
	},

	showGridView : function() {
		this.getView().byId("listm1").setVisible(false);
		this.getView().byId("tilem1").setVisible(true);
		this.getView().byId("listsbBtn1").setPressed(false);
		this.getView().byId("gridsbBtn1").setPressed(true);
	},

});
