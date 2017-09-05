jQuery.sap.require("sap.ui.usage.analytics.util.Formatter");
jQuery.sap.require("sap.ui.usage.analytics.util.Controller");
jQuery.sap.require("sap.m.MessageToast");
sap.ui.usage.analytics.util.Controller.extend("sap.ui.usage.analytics.view.App", {

	onInit : function() {
		var instance = {};
        instance.applicationid  = "06338df8-94b2-dd07-da1c-a63cdd8cf465";
        instance.productname    = "UsageTracking";
        instance.productversion = "1.0";
        instance.productpatch   = "1.0";
        
        if(window.localStorage)
            {
                var usageTrackingGuid= window.localStorage.getItem("usageTrackingGuid");
                if(usageTrackingGuid != undefined)
                    {
                        instance.installationid = usageTrackingGuid;
                    }
                else
                    {
                        
                        function S4() {
                            return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
                        }
                        usageTrackingGuid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                        window.localStorage.setItem("usageTrackingGuid",usageTrackingGuid);
                        instance.installationid= usageTrackingGuid;
                        
                    }
            }
        
        
        var configInfo = {};
        configInfo.tracking  = "on";
        configInfo.autocollect = "on";
        configInfo.getlocation = "on";
        instance.config=configInfo;
        window.ut('create',JSON.stringify(instance));
	},

	onAfterRendering : function() {
		var iNo = this.getOwnerComponent().getUser()
		this.getView().byId("userNameTextID").setText(iNo);
	},

	getOwnerComponent : function() {
		var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
		if (v === undefined) {
			return undefined
		}
		return sap.ui.component(v);
	},

	OnRegenerateView : function() {

	},
		
	openHelpTab:function(){
		window.open('./helpContent.html', '_blank'); 
	},

	logout:function(){
		window.location.replace('./logout.html', '_blank'); 
	},
	
	downloadSdk :function(item){
		window.open("./util/UsageCloudSDK.zip","_tab")
	},

	sendUsageTracking : function(json)
	{
		if(window.ut != undefined)
			window.ut('send','customkey',json);
		
	},
	

	  handlePressOpenMenu: function(oEvent) {
	    var oButton = oEvent.getSource();

	    // create menu only once
	    if (!this._menu) {
			this._menu = sap.ui.xmlfragment("sap.ui.usage.analytics.view.Menu", this);
	      this.getView().addDependent(this._menu);
	    }

	    var eDock = sap.ui.core.Popup.Dock;
	    this._menu.open(true, oButton.getDomRef() , eDock.BeginTop, eDock.BeginBottom,oButton.getDomRef());
	  },
	  
	 
	  
	  
	  
	  
	  handleMenuItemPress: function(oEvent) {
		var msg = "Feature in Implementation";
	      sap.m.MessageToast.show(msg);
	  },
	  
	  handleTextFieldItemPress: function(oEvent) {
	    var msg = "'" + oEvent.getParameter("item").getValue() + "' entered";
	      sap.m.MessageToast.show(msg);
	  }

});
