jQuery.sap.require("sap.m.MessageBox");
sap.ui.core.mvc.Controller
		.extend(
				"sap.ui.usage.analytics.view.AddProduct",
				{

					oAlertDialog : null,
					oBusyDialog : null,

					// initializeNewProductData : function() {
					// this.getView().getModel("newProduct").setData({
					// Detail : {
					// DefaultConfigFlag : true,
					// DefaultConfigEnabled : false
					// }
					// });
					// },

					Init : function() {
						this.p = /^[a-zA-Z0-9 _]+$/;
						sap.ui.getCore().getEventBus().subscribe("Master", "ProductEdit", this.onNavBack, this);
						this.getOwnerComponent().showHideMasterPage(this.getView(), true);

						this.getView().getModel("newProduct").setData({
							Detail : {
								DefaultConfigFlag : true,
								DefaultConfigEnabled : false,
								applicationidEnabled : false,
								productname : "",
								portfoliolevel1 : "",
								portfoliolevel2 : "",
								portfoliolevel3 : "",
								responsible : this.getOwnerComponent().getUser(),
								responsible_s : "",
								applicationid : this.getGuid()
							}
						});

					},

					onNavBack : function(oChannel, oCaller, oData) {
						this.getView().getModel("newProduct").setData({
							Detail : {
								applicationidEnabled : false,
								DefaultConfigEnabled : true,
								CustomConfigFlag : true,
								productname : oData.PRODUCTNAME,
								portfoliolevel1 : oData.PORTFOLIOLEVEL1,
								portfoliolevel2 : oData.PORTFOLIOLEVEL2,
								portfoliolevel3 : oData.PORTFOLIOLEVEL3,
								responsible : oData.RESPONSIBLE,
								responsible_s : oData.RESPONSIBLE_S,
								applicationid : oData.APPLICATIONID,
								DataArray : oData.DataArray
							}
						});
					},

					onRouteMatch : function(evt) {
						if ("AddProduct" !== evt.getParameter("name")) {
							return;
						}

						var id = evt.getParameter("arguments").id;
					},

					onAfterRendering : function() {
						// var uid = this.getGuid();
						// this.getView().getModel("newProduct").setData({
						// Detail : {
						// applicationid : uid,
						// applicationidEnabled : false,
						// DefaultConfigFlag : true,
						// DefaultConfigEnabled : false
						// }
						// });
					},

					onRouteMatched : function(oEvent) {
						var oParameters = oEvent.getParameters();

						jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
							var oView = this.getView();

							this._sProductId = oParameters.arguments.product;
							sData = oView.getModel().getData().DataArray;

							var oView = this.getView();
							oView.bindElement(null);

							// Which tab?
							var sTabKey = oParameters.arguments.tab || "supplier";
							this.getEventBus().publish("Detail", "TabChanged", {
								sTabKey : sTabKey
							});

							// var oIconTabBar =
							// oView.byId("idIconTabBar");
							//
							// if
							// (oIconTabBar.getSelectedKey()
							// !== sTabKey) {
							// oIconTabBar.setSelectedKey(sTabKey);
							// }
							//
							// oIconTabBar.bindElement(jQuery.sap.charToUpperCase(sTabKey,
							// 0));
						}, this))
					},

					onInit : function() {
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "newProduct");
						this.Init();
						sap.ui.getCore().getEventBus().subscribe("Master", "AddProductInitialLoad", this.Init, this);
					},

					onFirstItemSelected : function(sChannel, sEvent, oListItem) {
						this.bindView(oListItem.getBindingContext().getPath());
					},

					showErrorAlert : function(sMessage) {
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.alert(sMessage);
					},

					dateFromString : function(sDate) {
						// Try to create date directly, otherwise assume
						// dd/mm/yyyy
						var oDate = new Date(sDate);
						return oDate === "Invalid Date" ? new Date(sDate.split("/").reverse()) : oDate;
					},

					saveProduct : function(nID) {
						var mNewProduct = this.getView().getModel("newProduct").getData().Detail;
						// Basic payload data
						var mPayload = {
							ID : nID,
							Name : mNewProduct.Name,
							Description : mNewProduct.Description,
							ReleaseDate : this.dateFromString(mNewProduct.ReleaseDate)

						};

						if (mNewProduct.DiscontinuedDate) {
							mPayload.DiscontinuedDate = this.dateFromString(mNewProduct.DiscontinuedDate);
						}

						// Add supplier & category associations
						/*
						 * ["Supplier", "Category"].forEach(function(sRelation) {
						 * var oSelect = this.getView().byId("idSelect" +
						 * sRelation); var sPath =
						 * oSelect.getSelectedItem().getBindingContext().getPath();
						 * mPayload[sRelation] = { __metadata: { uri: sPath } }; },
						 * this);
						 */

						// Send OData Create request
						var oModel = this.getView().getModel();
						/*
						 * oModel.create("/Products", mPayload, { success :
						 * jQuery.proxy(function(mResponse) {
						 * this.initializeNewProductData();
						 * sap.ui.core.UIComponent.getRouterFor(this).navTo("product", {
						 * from: "master", product: "Products(" + mResponse.ID +
						 * ")", tab: "supplier" }, false);
						 * jQuery.sap.require("sap.m.MessageToast"); // ID of
						 * newly inserted product is available in mResponse.ID
						 * this.oBusyDialog.close();
						 * sap.m.MessageToast.show("Product '" + mPayload.Name + "'
						 * added"); }, this), error : jQuery.proxy(function() {
						 * this.oBusyDialog.close();
						 * this.showErrorAlert("Problem creating new product"); },
						 * this) });
						 */
						/*
						 * var oModel = that.getView().getModel(); var oData =
						 * oModel.getData(); this.initializeNewProductData();
						 * 
						 * var oldCollection = oData.Products; var newCollection =
						 * jQuery.grep(oldCollection, function (detail) { return
						 * detail.ID !== selectedDetail.ID; }); oData.Products=
						 * newCollection; oModel.setData(oData);
						 * sap.ui.core.UIComponent.getRouterFor(this).navTo("product", {
						 * from: "master", product: "Products(" + mResponse.ID +
						 * ")", tab: "supplier" }, false);
						 * jQuery.sap.require("sap.m.MessageToast"); // ID of
						 * newly inserted product is available in mResponse.ID
						 * this.oBusyDialog.close();
						 * sap.m.MessageToast.show("Product '" + mPayload.Name + "'
						 * added"); // tell list to update selection
						 * sap.ui.getCore().getEventBus().publish("app",
						 * "SelectDetail");
						 */
					},

					duplicateProductError : function() {
						if (arguments && arguments.length > 0 && arguments[1].body != 0) {
							this.getOwnerComponent().messageDisplay("Product already exist!!!", "Incorrect Input");
							this.prodStatus = false;
						}
					},

					onSave : function() {
						// Show message if no product name has been entered
						// Otherwise, get highest existing ID, and invoke create
						// for new product
						if (!this.validateInput())
							return;
						var productData = this.getView().getModel("newProduct").getProperty("/Detail");
						var customConfigSelected = this.getView().getModel("newProduct").getProperty(
								"/Detail/CustomConfigFlag");
						var formattedData = {};
						formattedData.PRODUCTNAME = productData.productname.trim();
						formattedData.APPLICATIONID = productData.applicationid;
						formattedData.PORTFOLIOLEVEL1 = productData.portfoliolevel1;
						formattedData.PORTFOLIOLEVEL2 = productData.portfoliolevel2;
						formattedData.PORTFOLIOLEVEL3 = productData.portfoliolevel3;
						formattedData.RESPONSIBLE = productData.responsible ? productData.responsible.toUpperCase()
								: "";
						formattedData.RESPONSIBLE_S = productData.responsible_s ? productData.responsible_s
								.toUpperCase() : "";
						formattedData.APPLICATIONSTATUS = 1;
						// formattedData.DataArray = [];

						this.prodStatus = true;
						this.getOwnerComponent().oDataService(
								'get',
								"/APPLICATION/$count?$filter=toupper(PRODUCTNAME) eq '"
										+ formattedData.PRODUCTNAME.toUpperCase() + "'",this, this.duplicateProductError);
						// sap.ui
						// .getCore()
						// .getModel()
						// .read(
						// "/APPLICATION/$count?$filter=toupper(PRODUCTNAME) eq
						// '"
						// + formattedData.PRODUCTNAME.toUpperCase() + "'",
						// null,
						// null,
						// false,
						// $
						// .proxy(
						// function(oData, oResponse) {
						// if (oResponse.body != 0) {
						// if (oResponse.headers
						// && oResponse.headers['com.sap.cloud.security.login']
						// === "login-request") {
						// alert("Session is expired, page shall be reloaded.");
						// window.location.reload();
						// } else {
						// this.getOwnerComponent().messageDisplay(
						// "Product already exist!!!",
						// "Incorrect Input");
						// this.prodStatus = false;
						// }
						// }
						// }, this),
						// $.proxy(function() {
						// try {
						// if (arguments && arguments.length > 0) {
						// var xmlDisplay = arguments[0].response.body;
						// var xmlDoc = $.parseXML(xmlDisplay);
						// xmlDisplay = $(xmlDoc);
						// this.getOwnerComponent().messageDisplay(
						// xmlDisplay.find("message").text(), "Failed");
						// }
						// } catch (exp) {
						//
						// this.getOwnerComponent().messageDisplay("Internal
						// Server Error",
						// "Failed");
						// }
						//
						// this.prodStatus = false;
						// }, this));

						if (!this.prodStatus) {
							// this.Init();
							return;
						}

						if (customConfigSelected) {
							// this.getView().byId("list").removeSelections(true);
							// reset app id on every save
							this.Init();
							formattedData.DataArray = productData.DataArray;
							sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
								applicationid : "productconfigure",
								product : "productconfigure",
								from : "AddProduct",
								currentView : this.getView(),
								targetViewName : "sap.ui.usage.analytics.view.productconfigure",
								targetViewType : "XML",
								transition : "slide",
								name : "productconfigure",
								id : formattedData.APPLICATIONID
							});

							// sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							// currentView : this.getView(),
							// targetViewName :
							// "sap.ui.usage.analytics.view.productconfigure",
							// targetViewType : "XML",
							// transition : "slide",
							// data : formattedData
							// });

							// sap.ui.getCore().setModel(formattedData);
							sap.ui.getCore().getEventBus().publish("Master", "ProductConfigure", formattedData);

						} else {

							var query = {
								'tableName' : '/APPLICATION',
								'data' : formattedData
							};
							this.getOwnerComponent().oDataService('create', query, this, this.productSaveSucceed,
									this.productSaveFail);
							// sap.ui.getCore().getModel().create('/APPLICATION',
							// formattedData, null,
							// $.proxy(this.productSaveSucceed, this),
							// $.proxy(this.productSaveFail, this));

							// sap.ui.getCore().getModel().refresh();

							// var response =
							// jQuery.proxy(this.getOwnerComponent().sendData(formattedData,
							// "add",
							// this.productSaveSucceed, this.productSaveFail),
							// this);

							var o = this.getView().getModel("newProduct");

							// if (this.getOwnerComponent().user ==
							// productData.responsible
							// || this.getOwnerComponent().user ==
							// productData.responsible_s) {
							// datetime = new Date();
							// var createddate = datetime.getFullYear() + "-" +
							// datetime.getMonth() + "-" + datetime.getDate() +
							// " "
							// + datetime.getHours() + ":" +
							// datetime.getMinutes();
							// productData.createddate = createddate;
							// productData.lastmodifieddate = createddate;
							// sap.ui.getCore().getEventBus().publish("Detail",
							// "ProductAdded",
							// productData);
							// }

							// reset app id on every save

							var prodData = this.getView().getModel("newProduct").getData().Detail;
							// sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							// currentView : this.getView(),
							// targetViewName :
							// "sap.ui.usage.analytics.view.informationview",
							// targetViewType : "XML",
							// transition : "slide",
							// name : "information",
							// });

							// var newData = {
							// "APPLICATIONID" : prodData.applicationid,
							// "PRODUCTNAME" : prodData.productname
							// };

							// sap.ui.getCore().getEventBus().publish("Master",
							// "InformationPageLoad", newData);
							this.Init();

						}
					},

					getOwnerComponent : function() {
						var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
						if (v === undefined) {
							return undefined
						}
						return sap.ui.component(v);
					},

					validateInput : function() {
						var bResult = false;
						var productData = this.getView().getModel("newProduct").getProperty("/Detail");

						if (!productData.productname)
							this.getOwnerComponent().messageDisplay("Product Name cannot be empty", "Incorrect Input");
						// else if
						// ((/[!$^*;<>?+=|~]+/i.test(productData.productname)))
						// {
						else if (!(this.p.test(productData.productname))) {
							this.getOwnerComponent().messageDisplay(
									"Invalid Product Name.[White spaces and special characters are not allowed]",
									"Incorrect Input");
						} else if (productData.productname.trim() === "") {
							this.getOwnerComponent().messageDisplay("Invalid Product Name", "Incorrect Input");

						} else if (!productData.portfoliolevel1 || !productData.portfoliolevel2
								|| !productData.portfoliolevel3)
							this.getOwnerComponent().messageDisplay("Product Portfolio cannot be empty",
									"Incorrect Input");
						else if (!(this.p.test(productData.portfoliolevel1))
								|| !(this.p.test(productData.portfoliolevel2))
								|| !(this.p.test(productData.portfoliolevel3))) {
							this.getOwnerComponent().messageDisplay(
									"Invalid Portfolio Name.[White spaces and special characters are not allowed]",
									"Incorrect Input");
						} else if ((productData.portfoliolevel1.trim() === "")
								|| (productData.portfoliolevel2.trim() === "")
								|| (productData.portfoliolevel3.trim() === "")) {
							this.getOwnerComponent()
									.messageDisplay("Invalid Product portfolio Name", "Incorrect Input");
						} else if (!productData.responsible)
							this.getOwnerComponent().messageDisplay("Administrator cannot be empty", "Incorrect Input");
						else if (!(this.p.test(productData.responsible))) {
							this.getOwnerComponent().messageDisplay(
									"Invalid responsible Name.[White spaces and special characters are not allowed]",
									"Incorrect Input");
						} else if (productData.responsible.trim() === "") {
							this.getOwnerComponent().messageDisplay("Invalid Administrator ID", "Incorrect Input");
						} else if (!productData.responsible_s)
							this.getOwnerComponent().messageDisplay("Substitute cannot be empty", "Incorrect Input");
						else if (!(this.p.test(productData.responsible_s))) {
							this.getOwnerComponent().messageDisplay(
									"Invalid substitute Name.[White spaces and special characters are not allowed]",
									"Incorrect Input");
						} else if (productData.responsible_s.trim() === "") {
							this.getOwnerComponent().messageDisplay("Invalid substitute ID", "Incorrect Input");
						} else if (productData.responsible == productData.responsible_s)
							this.getOwnerComponent().messageDisplay("Administrator and Substitute cannot be same",
									"Incorrect Input");
						// else if (this.getOwnerComponent().user.toUpperCase()
						// == productData.responsible.toUpperCase()
						// || this.getOwnerComponent().user.toUpperCase() ==
						// productData.responsible_s.toUpperCase()) {
						// bResult = true;
						// var allProducts =
						// this.getOwnerComponent().getModel().getData().DataArray;
						// if (allProducts) {
						// for (var i = 0; i < allProducts.length; i++) {
						// if (allProducts[i].productname.toUpperCase() ==
						// productData.productname.toUpperCase()) {
						// this.getOwnerComponent().messageDisplay("Product
						// already exists", "Incorrect Input");
						// return false;
						// }
						// }
						// }
						// }
						else
							bResult = true;

						return bResult;
					},

					productSaveSucceed : function(appID) {
						var that = this;
						var productData = this.getView().getModel("newProduct").getProperty("/Detail");
						var name = "Product (" + " " + productData.productname + " " + ") added successfully";

						this.getOwnerComponent().sendUsageTracking(
								'{"View":"Registration","Action":"ProductOnBoarding","SubAction1":"ProductSaved"}');
						this.getOwnerComponent().messageDialog(
								name,
								"Success",
								sap.m.MessageBox.Icon.SUCCESS,
								null,
								function(data, action, fSuccess, fFailure) {

									// jQuery.sap.require("sap.ui.usage.analytics.util.AjaxServices");
									// var ajaxLayer = new
									// sap.ui.usage.analytics.util.AjaxServices;
									var serviceParameter = {
										url : "/UsageCloudUI/ViewCreationServlet?appID=" + appID.APPLICATIONID
												+ "&type=withoutcustom",
										data : appID
									};
									var sendData = [];
									sendData = {
										"appID" : appID
									};
									serviceParameter.data = JSON.stringify(sendData);
									serviceParameter.async = true;

									that.getOwnerComponent().sendData(serviceParameter);
									// return ([
									// ajaxLayer.doCallAsync(serviceParameter,
									// null, null, null) ]);
								});

						// sap.m.MessageBox.show("Product added successfully");
					},

					productSaveFail : function() {
						if (arguments && arguments.length > 0) {
							var xmlDisplay = arguments[0].response.body;
							var xmlDoc = $.parseXML(xmlDisplay);
							xmlDisplay = $(xmlDoc);
							this.getOwnerComponent().messageDisplay(xmlDisplay.find("message").text(), "Failed");
						}

					},

					onClear : function() {
						// sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
						this.Init();
						this.getOwnerComponent().sendUsageTracking(
								'{"View":"Registration","Action":"ProductOnBoarding","SubAction1":"ClearAll"}');
					},

					onDialogClose : function(oEvent) {
						this.oAlertDialog.close();
					},

					getGuid : (function() {
						function s4() {
							return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
						}
						return function() {
							return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
						};
					})()

				});