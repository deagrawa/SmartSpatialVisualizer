jQuery.sap.declare("sap.ui.usage.analytics.util.Controller");

sap.ui.core.mvc.Controller.extend("sap.ui.usage.analytics.util.Controller", {
	getEventBus : function() {

		var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
		if (v === undefined) {
			return undefined
		}
		return sap.ui.component(v).getEventBus();
		//		return this.getOwnerComponent().getEventBus();
	},

	getRouter : function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}
});