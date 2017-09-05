sap.ui.controller("sap.ui.usage.analytics.documentation.masterShellContainer", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf helpcontent.masterShellContainer
	 */
	 onInit: function() {
		
	 },
	loadView : function(oEvent) {

		var splitContainer = this.getView().byId("idSplitContainer");
		var viewId = oEvent.getParameters().id.split('--')[1];
		splitContainer.removeAllContent();
		splitContainer.addContent(new sap.ui.view({
			viewName : "sap.ui.usage.analytics.documentation." + viewId,
			type : sap.ui.core.mvc.ViewType.XML
		}));
		headerText = this.getView().byId(viewId).getText();
		this.getView().byId("headTitle").setText(headerText);
	},
/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf helpcontent.masterShellContainer
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf helpcontent.masterShellContainer
 */
 onAfterRendering: function(evt) {
	 var splitContainer = this.getView().byId("idSplitContainer");
	 splitContainer.insertContent(sap.ui.view({id:"abcd1234", viewName:"sap.ui.usage.analytics.documentation.TBView", type:sap.ui.core.mvc.ViewType.XML}));
 },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf helpcontent.masterShellContainer
 */
// onExit: function() {
//
// }
});