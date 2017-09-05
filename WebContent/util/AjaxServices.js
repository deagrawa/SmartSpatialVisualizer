jQuery.sap.declare("sap.ui.usage.analytics.util.AjaxServices");
jQuery.sap.require("sap.ca.ui.utils.busydialog");

sap.ui.usage.analytics.util.AjaxServices = function () {
	
};

sap.ui.usage.analytics.util.AjaxServices.prototype.setComponent  = function(oComponent){
	this.oComponent = oComponent;
};

sap.ui.usage.analytics.util.AjaxServices.prototype.doCall = function(serviceParameter, fSuccess, fFailure){
	var requestConfig = {
	        dataType: "json",
	        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	        jsonp:false,
	        url : serviceParameter.url,
	        data : serviceParameter.data,
		type : serviceParameter.type,
		async : serviceParameter.async
	    };
	
//    $.ajax({
//        url: requestConfig.url,
//        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//        data: requestConfig.data,
//        type: 'post',
//        success: function(data){
//          alert("Success");
//        },
//        error:function(){
//            alert("failure");
//        }   
//    });
	
	try{
		sap.ca.ui.utils.busydialog.requireBusyDialog({
			text:"Loading..." //text is optional
		});
		
		var promise = $.ajax(requestConfig);
	
			if(promise.status  == "200"){
				if (fSuccess)
					fSuccess(promise.responseText, this.oComponent);
		} else {
				if(fFailure){
					fFailure(promise.responseText ? promise.responseText : "Internal Server Error", this.oComponent);        	
				}
			}
			
//			if (fFailure && promise.status != "200") {
		// $.proxy( fFailure(textStatus,
		// errorThrown,XMLHttpRequest.responseText) , that.oComponent);
//			}
		
		// release the BusyDialog to remove the waiting/blocking screen
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
		
		return promise.responseJSON;
	} catch (err) {
		var t;
		// release the BusyDialog to remove the waiting/blocking screen
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
		throw err;
	} finally {
	}
};

sap.ui.usage.analytics.util.AjaxServices.prototype.doCallAsync = function(serviceParameter, fSuccess, fFailure){
	var requestConfig = {
	        dataType: "json",
	        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	        jsonp:false,
	        url : serviceParameter.url,
	        data : serviceParameter.data,
	        type : "POST",
	        async : true,
	    };
	
//    $.ajax({
//        url: requestConfig.url,
//        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//        data: requestConfig.data,
//        type: 'post',
//        success: function(data){
//          alert("Success");
//        },
//        error:function(){
//            alert("failure");
//        }   
//    });
	
	try{
		sap.ca.ui.utils.busydialog.requireBusyDialog({
			text:"Loading..." //text is optional
		});
		
		var promise = $.ajax(requestConfig);
	
			if(promise.status  == "200"){
				if (fSuccess)
					fSuccess(promise.responseText, this.oComponent);
		} else {
				if(fFailure){
					fFailure(promise.responseText ? promise.responseText : "Internal Server Error", this.oComponent);        	
				}
			}
			
//			if (fFailure && promise.status != "200") {
		// $.proxy( fFailure(textStatus,
		// errorThrown,XMLHttpRequest.responseText) , that.oComponent);
//			}
		
		// release the BusyDialog to remove the waiting/blocking screen
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
		
		return promise.responseJSON;
	} catch (err) {
		var t;
		// release the BusyDialog to remove the waiting/blocking screen
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
		throw err;
	} finally {
	}
};

sap.ui.usage.analytics.util.AjaxServices.prototype.call = function (oServiceDescriptor, fSuccess, fFailure) {
    var argumentOffset = 3;

    var data = {};
    var i;
    for (i = 0; i < oServiceDescriptor.parameters.length; i++) {
        var paramName = oServiceDescriptor.parameters[i];
        var paramValue = arguments[i + argumentOffset];
        if (paramValue !== null && paramValue !== undefined) {
            if (typeof paramValue === "object") {
                // Need to stringify this object
                paramValue = JSON.stringify(paramValue);
            } else if (typeof paramValue === "number") {
                // Integer -> string
                paramValue = paramValue.toString();
            }
            data[paramName] = paramValue;
        }
    }
    
    var method = "POST";
    if (oServiceDescriptor.httpMethod) {
        method = oServiceDescriptor.httpMethod;
    }
    var async = true;
    if (oServiceDescriptor.synchronous) {
        async = false;
    }
    
    var jsonSanitizer = function(data, type) {
		// Fortify issue: Preventing Direct Execution of the Response
		// (javascript hijacking)
		// see JavaScript Hijacking, B. Chess, Y. O'Neil, and J. West,
		// http://www.fortifysoftware.com/servlet/downloads/public/JavaScript_Hijacking.pdf
		// Remove padding; currently json is prefixed by "@@" server side (see
		// com.sap.hilo.desktop.embeddedserver.JsonPaddingFilter java class)
        return data.slice(2);
    };
    
	var contentType = 'application/x-www-form-urlencoded; charset=UTF-8'; // default
																			// content-type
    if (oServiceDescriptor.contentType) {
        contentType = oServiceDescriptor.contentType;
    }
    
    var requestConfig = {
        dataType: "json",
        contentType: contentType,
        jsonp:false,
        url : url,
        data : data,
        type : method,
        async : async,
        dataFilter: jsonSanitizer
    };

	// Only modify the cache setting if explicitly requested by the caller so we
	// don't accidentally
    // mess up the default behaviour.
    if (typeof(oServiceDescriptor.cache) !== "undefined") {
        requestConfig.cache = oServiceDescriptor.cache; 
    }
    
    var promise = $.ajax(requestConfig);
    promise.done(function (incomingData) {
        if (incomingData && incomingData.notificationError) {
            if (window.errorModel) {
                var errorData = {};
                errorData.error = incomingData.notificationError;
            }
        }
        if (incomingData && incomingData.error) {
            if (fFailure) {
                fFailure(incomingData.error[0].actionRequired, incomingData.error[0].localizedMessage, incomingData);
            }
        } 
        /*
         * The following error check is made for incoming data from xsjs query,
		 * in which case the error status is sent as a part of the resultset If
		 * there is an error, the failuere call back is made
         */
		else if (incomingData && incomingData[0] && incomingData[0].executionStatus
				&& incomingData[0].executionStatus.status === "error") {
           // window.errorModel.updateErrorModel(incomingData);
            if (fFailure) {
                
                fFailure(null, incomingData[0].executionStatus.description, incomingData);
            }
		} else {
            if (fSuccess) {
            	$.proxy( fSuccess(incomingData) , this.oComponent);
            }
        }
        if (incomingData && incomingData.undoRedoInfo && sap.vi.common.Event) {
            
            var o = new sap.ui.base.Object();
            o.eventType = sap.vi.desktop.events.AppEvents.UNABLE_DISABLE_UNDO_REDO;
            o.extraParameters = incomingData.undoRedoInfo;
            return new sap.vi.common.Event(o).dispatch();
        }
    });
    promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (fFailure) {
        	$.proxy( fFailure(textStatus, errorThrown,XMLHttpRequest.responseText) , this.oComponent);
        }
    });
    return promise;
};
