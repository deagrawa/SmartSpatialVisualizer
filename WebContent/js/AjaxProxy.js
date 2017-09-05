doCall = function(serviceParameter, fSuccess, fFailure) {
	var requestConfig = {
		dataType : "json",
		contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
		jsonp : false,
		url : serviceParameter.url,
		data : serviceParameter.data,
		type : "POST",
		async : false,
	};

	try {

		var promise = $.ajax(requestConfig);

		if (promise.status == "200") {
			if (fSuccess)
				fSuccess(promise.responseText, this.oComponent);
		} else {
			if (fFailure) {
				fFailure(promise.responseText ? promise.responseText
						: "Internal Server Error", this.oComponent);
			}
		}

		return promise.responseJSON;
	} catch (err) {
		var t;
		// release the BusyDialog to remove the
		// waiting/blocking screen
		throw err;
	} finally {
	}
};

getUser = function() {
	var ssoUser = this.sendData({
		randomData : "abc"
	}, "getUser");

	return ssoUser;
	
//	if (ssoUser && ssoUser.length > 0 && ssoUser[0]
//			&& ssoUser[0].hasOwnProperty("UserName")) {
//		this.userDetails = ssoUser[0].UserName;
//	} else {
//		this.messageDisplay("No user found", "Internal Server Error");
//	}
//
//	if (ssoUser && ssoUser.length > 0 && ssoUser[0]
//			&& ssoUser[0].hasOwnProperty("hasRole")) {
//		this.setUser(ssoUser[0].hasRole);
//	} else {
//		this.messageDisplay("No user found", "Internal Server Error");
//	}

};

sendData = function(data, action, fSuccess, fFailure) {
	var serviceParameter = {
		url : "/UsageCloudUI/SsoAuthServlet/",
	};
	var sendData = [];
	var eventData = [ data ];
	sendData.push({
		"action" : action,
		"Events" : eventData
	});
	sendData = {
		"Actions" : sendData
	};
	serviceParameter.data = JSON.stringify(sendData);
	return ([ this.doCall(serviceParameter, fSuccess, fFailure) ]);
};
