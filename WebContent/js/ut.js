var ut =
	(function () {

	var utPreLoad;
	//defines the number of events that should be sent in a single request
	var NO_OF_EVENTS = 100;
	// defines maximum number of events that can be kept in the queue
	var MAX_Q_SIZE = 1000;
	// events queue for request object
	var sendq = [];
	//tells if the create call is successful or not. Till it is successful, no request will be made to backend
	var isInstalled = false;
	//controls enable/disable options for tracking. If true then tracking disabled
	var doNotTrack = true;
	//queue for capturing timeStamp corresponding to event occurence.
	var timeStamp = [];
	//queue for capturing event related data corresponding to ut call
	var eventMeta = [];
	//reference for holding event related info
	var eventObj = {};
	//to specify that create call is a valid call. If not valid then no events will be pushed to sendq.
	var validCreate = false;
	//reference for capturing global call by window object to ut
	var globalCall = {}
	//handle for notification
	var notify;
	//array for holding non-personal keys
	var keys = [];
	//sequence number corresponding to events
	var seqId = 0;
	//exponential backoff paramenter
	var backOffParameter = 1;
	//navigator geolocation handler
	var geo;
	//queue for events
	var eventsList = [];
	//holds information related to client
	var clientInfo;
	//Alias of the keynames of the customkeys
	var mapToKey = {};
	//The keynames order in which the keyvalues will be sent
	var keyOrder = {};
	//specifies that ut is called globally
	globalCall["type"] = "window";
	//variable for holding create request if tracking is turned off in config
	var createReq;

	if (typeof ut === 'function') {
		utPreLoad = ut;
	} else {
		return undefined;
	}
	//logging function
	var debug = function (log) {
		//console.log(log);
	}

	var utq = utPreLoad.q || [];
	eventMeta = utPreLoad.eventsq || [];

	var handle = function () {
		debug("Inside handle");
		//if an event triggered ut call then capture event related info
		if (window.event) {
			debug("event triggered ut call")
			var targetElement = window.event.target ? window.event.target : window.event.srcElement;
			eventObj["tagName"] = targetElement.tagName;
			eventObj["className"] = targetElement.className;
			eventObj["subClass"] = window.event.toString().substring(8, window.event.toString().length - 1);
			eventObj["type"] = window.event.type;
			eventMeta.push(eventObj);
		} else {
			//ut was called globally by window object. So, no event related info present.
			eventMeta.push(globalCall);
		}

		capture(arguments);
	};
	handle.q = utq;
	handle.set = true;

	//var trackerUrl = trackerUrl || "https://usagecloudx6bbcba19.neo.ondemand.com/UsageCloud/";
	var trackerUrl =  trackerUrl || "https://usagecloudxfd09ed1d.neo.ondemand.com/UsageCloud/";

	var configTrackerUrl = function (url) {
		trackerUrl = url ? url : trackerUrl;
	}
	//start capturing geolocation
	function captureGeolocation() {
		if (navigator.geolocation) {
			geo = navigator.geolocation.watchPosition(updatePosition);
		}
	}
	//updates geolocation if client is moving
	function updatePosition(pos) {
		if (!clientInfo) {
			clientInfo = {};
		}
		clientInfo["geolocation1"] = pos.coords.latitude.toString();
		clientInfo["geolocation2"] = pos.coords.longitude.toString();
	}
	// we use the progid Microsoft.XMLHTTP because
	// IE5.5 included MSXML 2.5; the progid MSXML2.XMLHTTP
	// is pinned to MSXML2.XMLHTTP.3.0

	var xhr = XMLHttpRequest
		 ? new XMLHttpRequest()
		 : ActiveXObject
		 ? new ActiveXObject('Microsoft.XMLHTTP')
		 : null;

	//sending request to backend server
	var sendXmlHttpRequest = function (request) {
		try {
			debug("sending request");
			xhr.open('POST', trackerUrl, true);
			xhr.onreadystatechange = function () {

				if (xhr.readyState === 4 && xhr.status === 200) {
					isInstalled = true;
					backOffParameter = 1;
				} else if (xhr.readyState === 4 && xhr.status === 403) {
					debug("Request rejected by backend");
					// failed because of create call. Empty the queue and stop pushing in queue.
					if (!isInstalled) {
						eventsList = [];
						sendq = [];
						validCreate = false;
						debug("Create call Failed");
					}
				} else if (xhr.readyState === 4 && !(xhr.status >= 200 && xhr.status < 300)) {
					debug("request failed");
					// request to backend failed
					xhr.abort();
					//exponential backoff. eventually limiting retry rate to 1 request per mintue
					backOffParameter = backOffParameter * 2;
					if (backOffParameter > 60)
						backOffParameter = 60;

					setTimeout(function () {
						//retry after 1 sec

						sendXmlHttpRequest(request);
					}, backOffParameter * 1000);

				}

			};

			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

			xhr.send(request);
		} catch (e) {
			console.log(e);
		}

	}

	var capture = function (capInfo) {

		timeStamp.push((new Date().toISOString().replace("Z", "").replace("T", " ")));

		if (eventsList.length >= MAX_Q_SIZE)
			eventsList.shift();

		utq.push(capInfo);

	}
	/**
	 * validate the length of applicationid
	 * @param {string} [str] the argument passed to ut
	 */

	var validateApplicationID = function (str) {
		/*if(str.length>=12 && str.length <=16)
		return true;
		else return false;
		 */
		return true;

	}

	/**
	 * validate the length of recordgroupid
	 * @param {string} [str] the argument passed to ut
	 */

	var validateRecordGroupID = function (str) {
		/*if(str.length>=12 && str.length <=16)
		return true;
		else return false;
		 */
		return true;

	}

	/**
	 * get the clientInfo
	 */

	var getMeta = function () {
		if (!clientInfo)
			clientInfo = {};
		//information like browser name, browser version, os name, os version are removed because these things can be extracted from user agent.

		//reverse geo coding needed
		clientInfo["country"];
		clientInfo["region"];
		clientInfo["city"];
		debug("getting auto collected info");
		clientInfo["href"] = window.document ? window.document.URL : window.location.href;
		clientInfo["title"] = window.document ? window.document.title : '';
		clientInfo["referrer"] = window.document ? window.document.referrer : '';
		clientInfo["host"] = window.location ? window.location.hostname : '';
		clientInfo["path"] = window.location ? window.location.pathname : '';
		clientInfo["protocol"] = window.location ? window.location.protocol : '';

		return clientInfo;
	}
	/**
	 *            hardcode response . will be removed once GET API is available
	 */

	var getDummyPermission = function () {
		return {
			"permission" : "all"
		};

	}
	/**
	 *            hardcode response . will be removed once GET API is available
	 */
	var getDummyKeys = function () {
		return {
			"permission" : "non-personal",
			"keys" : ["key1", "key2"]
		};
	}

	/**
	 *            make a GET request with query parameter 'q=permissionLevel'

	 */
	var getPermission = function () {
		debug("xhr for GET");
		keys = [];
		/**
		 * Asynchronous xhr will be made and once the response arrives following function will be a callback
		 * setTimeout is used for time being to emulate callback effect.
		 */
		//stop processing the queue
		clearInterval(proccess);

		setTimeout(function () {
			//following response is assumed for the time being
			//            getDummyPermission used to get hardcoded response and will be replaced with actual response once GET API is available
			var permission = getDummyPermission();
			debug("xhr response received");
			if (permission["permission"] === 'none') {
				debug("tracking denied");
				//if no permissions are provided then stop tracking
				doNotTrack = true;
				eventsList = [];
				utq = [];
				if (notify)
					notify("Not allowed by the organization");
			}
			//if permission given then start tracking
			else if (permission["permission"] === 'all') {
				doNotTrack = false;
				//start processing queue again
				setInterval(proccess, 1000);
			}
		}, 1);

	}
	/**
	 * make a GET request with query parameter 'q=nonPersonalKeys'

	 */

	var getPublicKeys = function () {
		//start tracking
		doNotTrack = false;
		clearInterval(proccess);

		/**
		 * Asynchronous xhr will be made and once the response arrives following function will be a callback
		 * setTimeout is used for time being to emulate callback effect.
		 */
		debug("xhr for GET api");
		setTimeout(function () {
			//following response is assumed for the time being
			//            getDummyKeys used to get hardcoded response and will be replaced with actual response once GET API is available
			debug("response received");
			var response = getDummyKeys();
			keys = [];
			//only keys that are defined as non-personal will be tracked
			keys = response["keys"];
			setInterval(proccess, 1000);

		}, 1);
	}

	//generates the browserSessionID
	function getSessionID() {
		debug("generating session ID");
		var sampleString = '';
		if (document.charset && document.body)
			sampleString = document.body.innerText;
		if (sampleString === '')
			sampleString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		var id = "";
		var randomNumber;
		//get the milliseconds by epoch
		var msec = new Date().getTime();
		//append the milliseconds to browsersessionid
		id += msec;
		var i;
		for (i = id.length; i < 20; i++) {
			randomNumber = Math.floor((Math.random() * sampleString.length));

			id += sampleString.slice(randomNumber, randomNumber + 1); //chop a random character from body.innertext

		}
		debug("session id generated");
		return id;

	}

	/**
	 * Create an instance of the client.
	 * @param {array} [args] The argument to ut. JSON object passed as instance.
	 */

	var create = function (args) {
		//creates an instance of the client. no tracking will be done till an instance is created

		debug("create call");
		if (!clientInfo)
			clientInfo = {};

		var obj;
		var x;
		var off = true;
		var createEvent = [];
		//to maintain presence of all mandatory fields
		var mandatory = {
			"applicationid" : false,
			"productname" : false,
			"productversion" : false,
			"productpatch" : false
		};

		try {
			obj = JSON.parse(args[1]);

		} catch (e) {}
		if (obj) {
			for (x in obj) {

				if (x === 'config') {
					if (obj[x].tracking) {
						if (obj[x].tracking === 'on') {
							if (window.navigator.doNotTrack && navigator.doNotTrack === "1") {
								doNotTrack = true;
								keys = [];

							} else {
								off = false;
								getPermission();
							}
						} else if (obj[x].tracking === 'off') {
							doNotTrack = true;
							keys = [];

						} else if (obj[x].tracking === 'non-personal')
							if (navigator.doNotTrack === "1") {
								doNotTrack = true;
								keys = [];

							} else {
								off = false;
								getPublicKeys();
							}
					}

					if (obj[x].geolocation) {
						if (obj[x].geolocation === 'on') {
							captureGeolocation();
						} else if (obj[x].geolocation === 'off') {
							navigator.geolocation.clearWatch(geo);
							delete clientInfo["geolocation1"];
							delete clientInfo["geolocation2"];

						}

					}
					if (obj[x].browsersessionid) {
						clientInfo["browsersessionid"] = obj[x].browsersessionid;
					}
					if (obj[x].alias) {
						var temp;
						try {
							temp = JSON.parse(obj[x].alias);

						} catch (e) {
							debug(e);
						}
						if (temp) {
							var x1;
							for (x1 in temp) {
								var arr = temp[x1];
								if (arr instanceof Array) {
									for (i in arr) {
										mapToKey[arr[i]] = x1;
									}

								} else {
									mapToKey[arr] = x1;
								}
							}
						}
					}
					if (obj[x].keyorder) {
						var temp;
						try {
							temp = JSON.parse(obj[x].keyorder);
						} catch (e) {
							debug(e);
						}
						if (temp) {
							keyOrder["keys"] = temp;
							debug("keyorder set");
						}
					}
				} else {
					clientInfo[x] = obj[x] ? obj[x] : '';
					mandatory[x] = true;
				}

			}
			debug("checking for mandatory fields");
			for (x in mandatory) {
				validCreate = mandatory[x];
				if (!validCreate) {
					debug("create call invalid");
					break;

				}
			}

			//set the browsersessionid
			if (!clientInfo["browsersessionid"]) {
				clientInfo["browsersessionid"] = getSessionID();
			}

			if (validCreate) {
				var sendOb = JSON.parse(JSON.stringify(getMeta()));

				if (eventObj["type"] !== "window") {
					for (x in eventObj) {
						sendOb[x] = eventObj[x];
					}
				}

				var tStamp = timeStamp.shift();
				if (tStamp)
					sendOb["tstamp"] = tStamp;
				else
					sendOb["tstamp"] = new Date().toISOString().replace("Z", "").replace("T", " ");
				var createq = [];
				var req = {};
				createq.push(sendOb);
				req["Events"] = createq;
				debug("sending request for create call");
				createEvent = [];
				if (!off || !doNotTrack) {
					createReq = null;
					sendXmlHttpRequest(encodeURI(JSON.stringify(req)));
				} else {
					createReq = req;
				}
			}
		}

	}

	/**
	 * process the queue to scan for queued events.

	 */

	function proccess() {
		debug("processing the queue");
		var sendOb = JSON.parse(JSON.stringify(getMeta()));
		var tStamp;
		while (utq.length) {
			//to send events in order
			var args = utq.shift();

			if (args[0] === 'create') {
				isInstalled = false;
				validCreate = false;
				if (navigator.doNotTrack !== "1") {
					create(args);
				}
				break;
			} else if (validCreate) {
				tStamp = timeStamp.shift();
				eventObj = eventMeta.shift();
				if (args[0] === 'config') {
					if (args[1] === 'tracking' && args[2]) {
						debug("config call");
						if (args[2] === 'on') {
							if (!isInstalled && createReq) {
								sendXmlHttpRequest(encodeURI(JSON.stringify(createReq)));
								createReq = null;
							}
							if (window.navigator.doNotTrack && navigator.doNotTrack == "1") {
								doNotTrack = true;
								keys = [];
								break;
							} else {
								getPermission();
								break;
							}
						} else if (args[2] === 'off') {
							//disable tracking
							doNotTrack = true;
							keys = [];
							break;
						} else if (args[2] === 'non-personal') {
							if (!isInstalled && createReq) {
								sendXmlHttpRequest(encodeURI(JSON.stringify(createReq)));
								createReq = null;
							}
							if (navigator.doNotTrack == "1") {
								doNotTrack = true;
								keys = [];

							} else {
								getPublicKeys();
							}
							break;
						}
					} else if (args[1] == 'keyorder' && args[2]) {
						//Set the keyorder
						var obj;
						try {
							obj = JSON.parse(args[2]);
						} catch (e) {
							debug(e);
						}
						if (obj) {
							keyOrder["keys"] = obj;
							debug("keyorder set");
						}
					} else if (args[1] == 'alias' && args[2]) {
						//Create the keyname alias
						var obj;
						var x;
						try {
							obj = JSON.parse(args[2]);

						} catch (e) {
							debug(e);
						}
						if (obj) {
							for (x in obj) {
								arr = obj[x];
								if (arr instanceof Array) {
									for (i in arr) {
										mapToKey[arr[i]] = x;
									}
								} else {
									mapToKey[arr] = x;
								}
							}
						}
						debug("keyname alias created");
					} else if (args[1] == 'browsersessionid' && args[2]) {
						clientInfo["browsersessionid"] = args[2];
					} else if (args[1] == 'geolocation') {
						if (args[2] == 'on') {
							captureGeolocation();
						} else if (args[2] === 'off') {
							navigator.geolocation.clearWatch(geo);
							if (clientInfo["geolocation1"]) {
								delete clientInfo["geolocation1"];
								delete clientInfo["geolocation2"];
							}

						}
					}
				} else if (args[0] === 'onnotification' && args[1]) {
					notify = args[1];
				}

				//push events to sendq only if tracking is enabled and create call was valid
				if (!doNotTrack && validCreate) {
					if (args[0] === 'send' && args.length === 1) {
						seqId++;
						var data = {};
						if (tStamp)
							data["tstamp"] = tStamp;
						else
							data["tstamp"] = new Date().toISOString().replace("Z", "").replace("T", " ");
						data["sequenceNo"] = seqId.toString();
						eventsList.push(JSON.parse(JSON.stringify(data)));

					} else if (args[0] === 'send' && ((args[1] === 'customkey' && args.length === 3) || (args[1] && (args[2] === 'customkey') && args.length === 4))) {
						seqId++;
						var obj;
						var x;
						var data = {};
						//to count how many custom keys in the JSON are actually allowed
						var count = 0;

						try {
							if (args[1] === 'customkey') {
								obj = JSON.parse(args[2]);

							} else if (args[2] === 'customkey') {
								obj = JSON.parse(args[3]);
							}

						} catch (e) {
							debug(e);
						}
						if (obj) {
							var keyName;
							for (x in obj) {
								if (mapToKey[x]) {
									keyName = mapToKey[x];
								} else {
									keyName = x;
								}
								if (!keys.length || keys.indexOf(keyName) != -1) {

									data[keyName] = obj[x];
									count++;
								}

							}
							if (count) {
								if (eventObj["type"] !== "window") {
									for (x in eventObj) {
										data[x] = eventObj[x];
									}
								}
								data["sequenceNo"] = seqId.toString();
								if (args[1] && args[2] === 'customkey') {
									data["recordgroupid"] = args[1];
								}
								if (tStamp)
									data["tstamp"] = tStamp;
								else
									data["tstamp"] = new Date().toISOString().replace("Z", "").replace("T", " ");
								eventsList.push(JSON.parse(JSON.stringify(data)));

							}
						}
					}
					//send the custom key if either 'keys' array is empty i.e. all keys allowed or given key is defined by the GET API
					else if (args[0] === 'send' && ((args[1] === 'customkey' && args.length === 4) || (args[1] && args[2] === 'customkey' && args.length === 5))) {
						seqId++;
						var data = {};
						var keyArg,
						valArg;
						var keyName;
						if (args[1] === 'customkey') {
							keyArg = 2;
							valArg = 3;
						} else {
							keyArg = 3;
							valArg = 4;
						}

						if (mapToKey[args[keyArg]]) {
							keyName = mapToKey[args[keyArg]];
						} else {
							keyName = args[keyArg];
						}

						if (!keys.length || keys.indexOf(keyName) != -1) {

							data[keyName] = args[valArg].toString();
							if (eventObj["type"] !== "window") {
								for (x in eventObj) {
									data[x] = eventObj[x];
								}

							}
							data["sequenceNo"] = seqId.toString();
							if (keyArg === 3) {
								data["recordgroupid"] = args[1];
							}
							if (tStamp)
								data["tstamp"] = tStamp;
							else
								data["tstamp"] = new Date().toISOString().replace("Z", "").replace("T", " ");
							eventsList.push(JSON.parse(JSON.stringify(data)));
						}

					}
					//send the keys as in keyorder
					else if (args[0] == 'send' && ((args[1] == 'keyorder' && args[2]) || (args[1] && args[2] === 'keyorder' && args[3]))) {
						seqId++;
						var data = {};
						var count = 0;
						var obj;
						try {
							if (args[1] === 'keyorder') {
								obj = JSON.parse(args[2]);
							} else {
								obj = JSON.parse(args[3]);
							}
						} catch (e) {
							debug(e);
						}
						if (obj) {
							var val = obj;
							var keyArr = keyOrder["keys"];
							if (keyArr) {
								var keyName;
								for (i = 0; i < val.length && i < keyArr.length; i++) {

									if (mapToKey[keyArr[i]]) {
										keyName = mapToKey[keyArr[i]];
									} else {
										keyName = keyArr[i];
									}
									if (!keys.length || keys.indexOf(keyName) != -1) {
										data[keyName] = val[i];
										count++;
									}

								}
							}
						}
						if (count) {
							if (eventObj["type"] !== "window") {
								var x;
								for (x in eventObj) {
									data[x] = eventObj[x];
								}
							}
							if (args[2] === 'keyorder') {
								data["recordgroupid"] = args[1];
							}
							data["sequenceNo"] = seqId.toString();
							if (tStamp)
								data["tstamp"] = tStamp;
							else
								data["tstamp"] = new Date().toISOString().replace("Z", "").replace("T", " ");
							eventsList.push(JSON.parse(JSON.stringify(data)));

						}
					}

				}
			}

		}
		if (eventsList.length) {

			if (eventsList.length >= NO_OF_EVENTS) {
				sendOb["DataArray"] = eventsList.splice(0, NO_OF_EVENTS);

			} else {
				if (eventsList.length === 1) {
					var temp = eventsList[0];
					var i;
					for (i in temp) {
						sendOb[i] = temp[i];
					}
				} else {
					sendOb["DataArray"] = eventsList;
				}
				eventsList = [];
			}
			sendq.push(sendOb);

		}

		try {
			if (sendq.length && ((((xhr.readyState && xhr.readyState === 4) && (xhr.status && xhr.status === 200)) || (xhr.status && xhr.status === 403)) && isInstalled)) {

				//send the request if there are apt number of events queued, there are no pending requests and create call to backend was successful.
				var req = {};
				//remove the current request's content from sendq
				if (sendq.length >= 1)
					req["Events"] = sendq.splice(0, 1);
				else {
					req["Events"] = sendq;
					sendq = [];
				}

				debug("sending request for events collected");
				sendXmlHttpRequest(encodeURI(JSON.stringify(req)));

			}
		} catch (e) {
			debug(e);
		}
	}

	//process the events queue every sec
	setInterval(proccess, 1000);

	return handle;
})();
