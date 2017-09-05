jQuery.sap.declare("sap.ui.usage.analytics.util.Formatter");

sap.ui.usage.analytics.util.Formatter = {

	uppercaseFirstChar : function(sStr) {
		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
	},

	discontinuedStatusState : function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue : function(sDate) {
		return sDate ? "Discontinued" : "";
	},

	currencyValue : function (value) {
		return parseFloat(value).toFixed(2);
	},
	
//	Date : function(value) {
//		if (value) {
//			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
//				pattern : "yyyy-MM-dd kk:mm:ss"
//			});
//			return oDateFormat.format(new Date(value));
//		} else {
//			return value;
//		}
//	},
	
	Date: function(value){

		if (value) {
			var d = value.split(" ")[0].split("-");
			var t = value.split(" ")[1].split(":");
			value = new Date(d[0], d[1], d[2], t[0], t[1], t[2]);
			var oDateFormat = sap.ui.core.format.DateFormat
					.getDateTimeInstance({
						pattern : "dd-MM-yyyy kk:mm:Ss"
			});
			return oDateFormat.format(value);
		} else {
			return value;
		}
	},
	
	appStatus : function(value) {
		return value == "1" ? true : false;
	}

};