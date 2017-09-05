sap.ui.controller("sap.ui.usage.analytics.view.informationview", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf view.informationview
	 */
	onInit : function() {
		sap.ui.getCore().getEventBus().subscribe("Master", "InformationPageLoad", this.Init, this);
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "newProduct");

	},

	Init : function(oChannel, oEvent, oData) {
		this.getView().getModel("newProduct").setData(oData);
		this.getView().getModel("newProduct").refresh();
	}

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf view.informationview
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf view.informationview
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf view.informationview
 */
// onExit: function() {
//
// }
});