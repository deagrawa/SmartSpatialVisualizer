sap.ui
		.controller(
				"sap.ui.usage.analytics.view.productHierarchy",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf com.sap.usageanalytics.productSummary
					 */
					onInit : function() {
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "newProduct");
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "hData");
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "addedHData");
						this.hierarchyCBox = [];
						this.hierarchyLabel = [];
						// this.Init();

						sap.ui.getCore().getEventBus().subscribe("Master", "ProductHierarchyLoad", this.Init, this);

						// this.hierarchyCBox.push(this.getView().byId("cBoxId1"));
						// this.hierarchyCBox.push(this.getView().byId("cBoxId2"));

						this.getOwnerComponent().showHideMasterPage(this.getView(), false);

					},

					Init : function(oChannel, oCaller, oData) {
						this.getView().byId("heirarchypanelid").setVisible(true);
						this.getView().getModel("newProduct").setData(oData);

						this.removeAllH();

						var firstLabel = new sap.m.Label({
							text : "1st Level"
						});
						firstLabel.addStyleClass("hierarchylabelclass");
						this.hierarchyLabel.push(firstLabel);
						this.getView().byId("heirarchygridid").insertContent(firstLabel, 999);

						var firstCBox = new sap.m.ComboBox({
							width : '100%',
							change : [ this.comboSelectionChange, this ]
						});
						this.hierarchyCBox.push(firstCBox);
//						firstCBox.onkeyup = function() {
//							firstCBox.setValue("");
//							firstCBox.close();
//						}

						this.getView().byId("heirarchygridid").insertContent(firstCBox, 999);
						this.k++;

						var secondLabel = new sap.m.Label({
							text : "2nd Level"
						});
						secondLabel.addStyleClass("hierarchylabelclass");
						this.hierarchyLabel.push(secondLabel);
						this.getView().byId("heirarchygridid").insertContent(secondLabel, 999);

						var secondCBox = new sap.m.ComboBox({
							width : '100%',
							change : [ this.comboSelectionChange, this ]
						});
						this.hierarchyCBox.push(secondCBox);
//						secondCBox.onkeyup = function() {
//							secondCBox.setValue("");
//							secondCBox.close();
//						}
						this.getView().byId("heirarchygridid").insertContent(secondCBox, 999);
						this.k++;

						// var addedHData =
						// this.getView().getModel("addedHData").getData();
						// addedHData.DataArray = [];

						if (this.getView().getModel("addedHData").getData().DataArray
								&& this.getView().getModel("addedHData").getData().DataArray.length > 0) {
							this.getView().getModel("addedHData").refresh();
						} else {
							this.getView().byId("listtable").destroyItems();
							this.getView().getModel("addedHData").setData({
								"DataArray" : []
							});

							// this.getView().byId("heirarchylistid").removeAllItems();
						}

						this.onClear();
						this.getOwnerComponent().showHideMasterPage(this.getView(), false);

						/*
						 * var i=this.hierarchyCBox.length; for(var
						 * nCBox=0;nCBox<i-2;nCBox++) {
						 * this.hierarchyCBox[nCBox].destroy(); //
						 * removeByIndex(this.hierarchyCBox, nCBox); }
						 * this.hierarchyCBox = [];
						 */
						// var metaDataKeys =
						// this.getView().getModel("masterData").getData("CommonFactKeys");
						// var customKeys =
						// this.getView().getModel("newProduct").getData();
						// metaDataKeys.concat(customKeys);
						var prodData = this.getView().getModel("newProduct").getData();

						// prodData.HData = [ ];
						if ((prodData.DataArray && prodData.DataArray.length == 1) || (this.ListItems.length == 0)) {
							this.getView().byId("heirarchypanelid").setVisible(false);
						}

						if (!prodData.DataArray)
							return;
						this.setQuickView();
					},

					setQuickView : function() {
						var qview = new sap.ui.ux3.QuickView({
							// type : "Plant",
							width : "500px"

						}).setShowActionBar(false).setActionBar();

						var a = new sap.ui.commons.Label({
							text : "Name of Product",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold

						});
						var b = new sap.m.Text({
							text : "{newProduct>/PRODUCTNAME}",

							width : "300px",
						});
						var c = new sap.ui.commons.Label({
							text : "ProductId",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold

						});
						var d = new sap.m.Text({
							text : "{newProduct>/APPLICATIONID}",

							width : "300px",
						});
						var e = new sap.ui.commons.Label({
							text : "Product PortFolio",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold

						});

						var f = new sap.m.Text(
								{
									text : "{newProduct>/PORTFOLIOLEVEL1}//{newProduct>/PORTFOLIOLEVEL2}//{newProduct>/PORTFOLIOLEVEL3}",

									width : "300px",
								});

						var g = new sap.ui.commons.Label({
							text : "Adminstrator",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold
						});

						var h = new sap.m.Text({
							text : "{newProduct>/RESPONSIBLE}",
							width : "300px",

							wrapping : true
						});

						var i = new sap.ui.commons.Label({
							text : "Administrator(Substitute)",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold

						});

						var j = new sap.m.Text({
							text : "{newProduct>/RESPONSIBLE_S}",

							width : "300px",
						});

						var oLayout1 = new sap.ui.layout.HorizontalLayout({
							content : [ a, b ]
						});
						var oLayout2 = new sap.ui.layout.HorizontalLayout({
							content : [ c, d ]
						});
						var oLayout3 = new sap.ui.layout.HorizontalLayout({
							content : [ e, f ]
						});
						var oLayout4 = new sap.ui.layout.HorizontalLayout({
							content : [ g, h ]
						});
						var oLayout5 = new sap.ui.layout.HorizontalLayout({
							content : [ i, j ]
						});

						qview.addContent(oLayout1).addContent(oLayout2).addContent(oLayout3).addContent(oLayout4)
								.addContent(oLayout5);
						// this.getView().byId("productNameLabelHId").setTooltip(qview.clone());
						this.getView().byId("productNameTextHId").setTooltip(qview.clone());
						// this.getView().byId("productIdLabelHId").setTooltip(qview.clone());
						this.getView().byId("productIdTextHId").setTooltip(qview.clone());
					},

					onNavBack : function() {
						var formattedData = this.getView().getModel("newProduct").getData();
						sap.ui.getCore().getEventBus().publish("Master", "OnProductConfigureNav", formattedData);
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							// this.getRouter().navTo("addProduct",{
							applicationid : "AddProduct",
							product : "AddProduct",
							from : "productHierarchy",
							currentView : this.getView(),
							targetViewName : "sap.ui.usage.analytics.view.productconfigure",
							targetViewType : "XML",
							transition : "slide",
							name : "ProductConfigure",
						});

					},

					onCancel : function() {
						this.removeAllH();
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							// this.getRouter().navTo("addProduct",{
							applicationid : "AddProduct",
							product : "AddProduct",
							from : "productHierarchy",
							currentView : this.getView(),
							targetViewName : "sap.ui.usage.analytics.view.AddProduct",
							targetViewType : "XML",
							transition : "slide",
							name : "AddProduct",
						});

						// clearing added Hierarchy for next visit(for nav Back
						// functionality)
						this.getView().getModel("addedHData").setData({
							"DataArray" : []
						});

						// this.getView().byId("heirarchylistid").removeAllItems();

						this.getOwnerComponent().showHideMasterPage(this.getView(), true);

					},
					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf com.sap.usageanalytics.productSummary
					 */
					// onBeforeRendering: function() {
					//
					// },
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf com.sap.usageanalytics.productSummary
					 */
					onAfterRendering : function() {

						this.getView().byId("productNameLabelHId").addStyleClass("textAlign");
						this.getView().byId("productIdLabelHId").addStyleClass("textAlign");

						var prodLabelArray = $('.textAlign');
						for (var i = 0; i < prodLabelArray.length; i++) {
							$('.textAlign')[i].setAttribute("class", "textAlign");
						}
					},

					getOwnerComponent : function() {
						var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
						if (v === undefined) {
							return undefined
						}
						return sap.ui.component(v);
					},

					onDone : function() {
						var prod = this.getView().getModel("newProduct").getData("Details");
						var name = "product (" + " " + prod.PRODUCTNAME + " " + ") added successfully";
						var prodData = this.getView().getModel("newProduct").getData();
						this.removeAllH();
						// saving product
						var formattedData = jQuery.extend(true, {}, prodData);
						delete formattedData.DataArray;
						sap.ui.getCore().getModel().create('/APPLICATION', formattedData, null, $.proxy(function() {
							this.appRegStatus = true;
						}, this), $.proxy(function() {
							this.appRegStatus = false;
						}, this));

						if (!this.appRegStatus) {
							this.getOwnerComponent().messageDisplay("Internal Server Error", "Failed");
							return;
						}

						var customData = {};
						if (prodData.DataArray != undefined && prodData.DataArray.length > 0) {
							for (var i = 0; i < prodData.DataArray.length; i++) {
								// if (prodData.DataArray[i].Formula)
								// prodData.DataArray[i].Formula =
								// encodeURIComponent(prodData.DataArray[i].Formula);

								// customData = prodData.DataArray[i];
								customData.APPLICATIONID = prodData.APPLICATIONID;
								customData.ID = prodData.DataArray[i].ID;
								customData.CUSTOMKEYDATATYPEID = prodData.DataArray[i].CustomKeyDataTypeID;
								customData.CUSTOMKEYDATALENGTH = prodData.DataArray[i].CustomKeyDataLength;
								customData.CUSTOMKEYDISPLAYLABEL = prodData.DataArray[i].CustomKeyDisplayLabel;
								customData.CUSTOMKEYDISPLAYORDER = prodData.DataArray[i].CustomKeyDisplayOrder;
								customData.CUSTOMKEYANALYTICTYPEID = prodData.DataArray[i].CustomKeyAnalyticTypeID;
								customData.FORMULAESUPPORTED = prodData.DataArray[i].FormulaeSupported;
								customData.DEFAULTAGGREGATION = prodData.DataArray[i].DefaultAggregation;
								customData.CONSTRAINTID = prodData.DataArray[i].ConstraintID;
								customData.FORMULA = prodData.DataArray[i].Formula;
								customData.HIERARCHYNAME = prodData.DataArray[i].HierarchyName;
								customData.HIERARCHYLEVEL = prodData.DataArray[i].HierarchyLevel;
								customData.CUSTOMKEYNAME = prodData.DataArray[i].CustomKeyName;

								var customDataquery = {
									"tableName" : "/CUSTOMCOLUMNMETADATA",
									"data" : customData
								};
								this.getOwnerComponent().oDataService('create', customDataquery, this);
								// sap.ui.getCore().getModel().create('/CUSTOMCOLUMNMETADATA',
								// customData, null,
								// $.proxy(function() {
								// this.customConfigStatus = true;
								// }, this), $.proxy(function() {
								// this.customConfigStatus = false;
								// }, this));
							}
							// sap.ui.getCore().getModel().refresh();

							var viewCreationQuery = {
								"tableName" : "/FORMULAMASTER",
								"data" : {
									APPLICATIONID : prodData.APPLICATIONID
								}
							};

							this.getOwnerComponent().oDataService('create', viewCreationQuery, this,
									this.productSaveSucceed, this.productSaveFail);

							// sap.ui.getCore().getModel().create('/FORMULAMASTER',
							// {
							// APPLICATIONID : prodData.APPLICATIONID
							// }, null, $.proxy(this.productSaveSucceed, this),
							// $.proxy(this.productSaveFail, this));
						} else { // implies product is registered without any
							// custom configurations
							// var ajaxLayer = new
							// sap.ui.usage.analytics.util.AjaxServices;
							var serviceParameter = {
								url : "/UsageCloudUI/ViewCreationServlet?appID=" + prodData.APPLICATIONID
										+ "&type=withoutcustom",
								data : prodData.APPLICATIONID
							};

							var sendData = [];
							sendData = {
								"appID" : prodData.APPLICATIONID
							};
							serviceParameter.data = JSON.stringify(sendData);
							serviceParameter.async = true;
							this.getOwnerComponent().sendData(serviceParameter);

							// ajaxLayer.doCallAsync(serviceParameter, null,
							// null, null);

							this.getOwnerComponent().messageDialog(name, "Success", sap.m.MessageBox.Icon.SUCCESS);
						}

						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							// this.getRouter().navTo("addProduct",{
							applicationid : "AddProduct",
							product : "AddProduct",
							from : "productHierarchy",
							currentView : this.getView(),
							targetViewName : "sap.ui.usage.analytics.view.AddProduct",
							targetViewType : "XML",
							transition : "slide",
							name : "productHierarchy",
						});

						// clearing added Hierarchy for next visit(for nav Back
						// functionality)
						this.getView().getModel("addedHData").setData({
							"DataArray" : []
						});

						// this.getView().byId("heirarchylistid").removeAllItems();

						this.getOwnerComponent().showHideMasterPage(this.getView(), true);
					},

					productSaveSucceed : function(appID) {
						var sessionValid = true;
						if (arguments && arguments.length > 0) {
							for (var i = 0; i < arguments.length; i++) {
								if (arguments[i] && arguments[i].headers
										&& arguments[i].headers['com.sap.cloud.security.login'] === "login-request") {
									sessionValid = false;
									alert("Session is expired, page shall be reloaded.");
									window.location.reload();
									break;
								}
							}
						}
						if (sessionValid) {
							var that = this;
							var prod = this.getView().getModel("newProduct").getData("Details");
							var name = "Product (" + " " + prod.PRODUCTNAME + " " + ") added successfully";
							this.getOwnerComponent().sendUsageTracking(
									'{"View":"Registration","Action":"Hierarchy","SubAction1":"ProductAdded"}');
							this.getOwnerComponent().messageDialog(
									name,
									"Success",
									sap.m.MessageBox.Icon.SUCCESS,
									null,
									function(data, action, fSuccess, fFailure) {

										jQuery.sap.require("sap.ui.usage.analytics.util.AjaxServices");
										var ajaxLayer = new sap.ui.usage.analytics.util.AjaxServices;
										var serviceParameter = {
											url : "/UsageCloudUI/ViewCreationServlet?appID=" + appID.APPLICATIONID
													+ "&type=custom",
											data : appID
										};

										var sendData = [];
										sendData = {
											"appID" : appID
										};

										serviceParameter.async = true;
										serviceParameter.data = JSON.stringify(sendData);
										that.getOwnerComponent().sendData(serviceParameter);
										// return ([
										// ajaxLayer.doCallAsync(serviceParameter,
										// null, null, null) ]);
									});
						}

					},

					productSaveFail : function() {
						try {
							if (arguments && arguments.length > 0) {
								var xmlDisplay = arguments[0].response.body;
								var xmlDoc = $.parseXML(xmlDisplay);
								xmlDisplay = $(xmlDoc);
								this.getOwnerComponent().messageDisplay(xmlDisplay.find("message").text(), "Failed");
							}
						} catch (exp) {

							this
									.getOwnerComponent()
									.messageDisplay(
											"Application registered successfully, Error in view creation. Please raise JIRA request to complete the process",
											"Failed");
						}

						// var xmlDisplay = arguments[0].response.body;
						// var xmlDoc = $.parseXML( xmlDisplay );
						// xmlDisplay = $( xmlDoc );

						// /
						// sap.m.MessageBox.show(xmlDisplay.find("message").text(),
						// sap.m.MessageBox.Icon.ERROR, "Error");

					},

					onAdd : function() {
						if (!this.validateInput())
							return;
						this.getOwnerComponent().sendUsageTracking(
								'{"View":"Registration","Action":"Hierarchy","SubAction1":"HierarchyAdded"}');

						var prodData = this.getView().getModel("newProduct").getData();
						// prodData.HData = [ {
						// "HName" : "HName1",
						// "HLevel" : [ "recordId1", "recordId2" ]
						// }, {
						// "HName" : "HName2",
						// "HLevel" : [ "recordId3", "recordId4" ]
						// } ];

						var hData = this.getView().getModel("hData").getData();
						var addedHData = this.getView().getModel("addedHData").getData();

						for (var nCBox = 0; nCBox < this.hierarchyCBox.length; nCBox++) {
							var customKeyName = this.hierarchyCBox[nCBox].getValue();
							for (var i = 0; i < prodData.DataArray.length; i++) {
								if (prodData.DataArray[i].CustomKeyName == customKeyName) {
									hData.HLevel.push(customKeyName);
									prodData.DataArray[i].HierarchyName = hData.HName;
									prodData.DataArray[i].HierarchyLevel = nCBox + 1;
									break;
								}
							}
						}

						addedHData.DataArray.push(hData);

						var oTable = this.getView().byId("listtable");
						var tData = oTable.getModel("addedHData").getData().DataArray;
						var aColumnData = [ {
							columnId : "Hierarchy Name"
						}, {
							columnId : "Hierarchy Level"
						}, {
							columnId : "Edit"
						}, {
							columnId : "Delete"
						} ];

						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData({
							columns : aColumnData,
							rows : tData
						});
						oTable.setModel(oModel);
						var that = this;
						oTable.bindItems("/rows", function(index, context) {
							var rowObject = context.getObject();
							var row = new sap.m.ColumnListItem();

							row.addCell(new sap.m.Text({
								text : rowObject["HName"]
							}));
							row.addCell(new sap.m.Text({
								text : rowObject["HLevel"]
							}));

							var deleteIcon = new sap.ui.core.Icon();
							deleteIcon.setSrc("sap-icon://delete").attachPress(function(evt) {
								var k = that.getView().getModel("addedHData").getData().DataArray;

								for (var i = 0; i < k.length; i++) {
									if (rowObject.HName === k[i].HName) {
										{
											k.splice(i, 1);
											delete (rowObject);
											evt.getSource().getParent().destroy();
											break;
										}
									}
								}

								var prodData = that.getView().getModel("newProduct").getData();
								for (var i = 0; i < prodData.DataArray.length; i++) {
									if ($.inArray(prodData.DataArray[i].CustomKeyName, rowObject["HLevel"]) > -1) {
										prodData.DataArray[i].HierarchyName = "";
										prodData.DataArray[i].HierarchyLevel = "";
									}
								}

								that.getView().getModel("addedHData").refresh();
							});

							row.addCell(deleteIcon);

							// var editIcon = new
							// sap.ui.core.Icon();
							// editIcon.setSrc("sap-icon://edit")
							// row.addCell(editIcon);
							// var deleteIcon = new
							// sap.ui.core.Icon();
							// deleteIcon.setSrc("sap-icon://delete")
							// row.addCell(deleteIcon);

							return row;
						});
						// prodData.HData = [ {
						// "HName" : "HName1", // "HLevel" : [ "recordId1",
						// "recordId2" ]
						// }, {
						// "HName" : "HName2",
						// "HLevel" : [ "recordId3", "recordId4" ]
						// } ];

						// prodData.HData.push({"HName": hData.HName, "HLevel":
						// [hData.HLevel1,
						// hData.HLevel2, hData.HLevel3]});
						this.getView().getModel("newProduct").refresh();
						this.getView().getModel("addedHData").refresh();
						// oList.refreshItems();

						this.getView().byId("heirarchypanelid").setExpanded(false);
						this.removeAllH();
						this.onClear();
					},

					destroyCBox : function(elem, index, array) {
						if (index >= 0) {
							if (elem) {
								elem.destroy();
							}
						}

						return true;
					},

					onClear : function() {
						this.getView().getModel("hData").setData({
							"HName" : "",
							"HType" : "",
							"HLevel1" : "",
							"HLevel2" : "",
							"HLevel" : []
						});

						// clearing all CBox values
						// for (var nCBox = 0; nCBox <
						// this.hierarchyCBox.length; nCBox++) {
						// this.hierarchyCBox[nCBox].setValue("");
						// }

						this.ListItems = [];
						var prodData = this.getView().getModel("newProduct").getData();
						if (prodData.DataArray) {
							for (var i = 0; i < prodData.DataArray.length; i++) {
								if (prodData.DataArray[i].Formula == "") {
									this.ListItems.push(new sap.ui.core.ListItem({
										text : prodData.DataArray[i].CustomKeyName
									}));
								}
							}
						}

						for (var i = 0; i < this.hierarchyCBox.length; i++) {
							this.hierarchyCBox[i].setValue("");
						}

						this.refreshCBoxItems();

					},

					removeAllH : function() {
						this.hierarchyLabel.every(this.destroyCBox);
						this.hierarchyCBox.every(this.destroyCBox);
						this.hierarchyLabel = [];
						this.hierarchyCBox = [];
						this.k = 1;
					},

					onHClear : function() {
						var prodData = this.getView().getModel("newProduct").getData();
						for (var i = 0; i < prodData.DataArray.length; i++) {
							prodData.DataArray[i].HierarchyName = "";
							prodData.DataArray[i].HierarchyLevel = "";
						}
						this.getView().getModel("newProduct").refresh();
					},

					onEditPress : function() {

						var prodData = this.getView().getModel("newProduct").getData();

						if (this.hierarchyCBox.length >= prodData.DataArray.length) {
							this.getOwnerComponent().messageDisplay(
									"Hierarchy Levels should not exceed the Custom Configuration columns ",
									"Incorrect Input");
							return;
						}

						var txt = this.k + 'rd Level';
						if (this.k == 1) {
							txt = this.k + 'st Level'
						} else if (this.k == 2) {
							txt = this.k + 'nd Level'
						} else if (this.k == 3) {
							txt = this.k + 'rd Level';
						}

						if (this.k > 3)
							txt = this.k + 'th Level';
						this.k = this.k + 1;

						var k = new sap.m.Label({
							text : txt
						});

						k.addStyleClass("hierarchylabelclass");
						this.hierarchyLabel.push(k);
						var o = new sap.m.ComboBox({
							width : '100%',
							change : [ this.comboSelectionChange, this ]
						});

						// o.attachChange($.proxy(this.comboSelectionChange,this));
						// o.setEditable(false);
						this.hierarchyCBox.push(o);
//						o.onkeyup = function() {
//							o.setValue("");
//							o.close();
//						}

						this.getView().byId("heirarchygridid").insertContent(k, 999);
						this.getView().byId("heirarchygridid").insertContent(o, 999);
						this.refreshCBoxItems();

					},
					validateInput : function() {
						var bResult = false;

						var dataArray = this.getView().getModel("newProduct").getData("Details").DataArray;
						var hData = this.getView().getModel("hData").getData();

						var noCustomKey = 0;
						for (var nCBox = 0; nCBox < this.hierarchyCBox.length; nCBox++) {
							var customKeyName = this.hierarchyCBox[nCBox].getValue();
							if (customKeyName) {
								noCustomKey++;
								if (noCustomKey > 1)
									break;
							}
						}

						if (noCustomKey < 2) {
							this.getOwnerComponent().messageDisplay("Minimum 2 hierarchy levels should be added",
									"Incorrect Input");
							return false;
						}

						if (!hData.HName) {
							this.getOwnerComponent()
									.messageDisplay("Hierarchy name cannot be empty", "Incorrect Input");
							// } else if (!hData.HType) {
							// this.getOwnerComponent().messageDisplay("Hierarchy
							// Type cannot be
							// empty", "Incorrect Input");
						} else if (hData.HName.indexOf(' ') >= 0) {
							this.getOwnerComponent().messageDisplay("Hierarchy name cannot contain spaces",
									"Incorrect Input");
						} else
							bResult = true;

						if (dataArray && hData.HName) {
							for (var i = 0; i < dataArray.length; i++) {
								// var
								// m=dataArray[i].HierarchyName.toUpperCase();
								if (dataArray[i].HierarchyName.toUpperCase() == hData.HName.toUpperCase()) {
									this.getOwnerComponent().messageDisplay("Hierarchy already exists",
											"Incorrect Input");
									return false;
								}
							}
						}

						var ListData = this.getView().getModel("newProduct").getData();
						var flag = false;

						for (var i = 0; i < this.hierarchyCBox.length; i++) {
							for (var j = 0; j < ListData.DataArray.length; j++) {
								if (this.hierarchyCBox[i].getValue() == ListData.DataArray[j].CustomKeyName) {
									flag = true;
									break;
								} else {
									flag = false;
								}
							}
							if (flag == false) {
								sap.m.MessageToast.show("Invalid Configuration name")
								return false;
							} else {
								

							}

						}

						return bResult;
					},

					comboSelectionChange : function(oEvent) {
						var selectedCBox = oEvent.getSource();
						if (!selectedCBox)
							return;

						this.refreshCBoxItems();
					},

					refreshCBoxItems : function(oEvent) {
						selectedItems = [];
						var addedHData = this.getView().getModel("addedHData").getData();

						// add already added HLevel for filtering
						if (addedHData.DataArray) {
							for (var i = 0; i < addedHData.DataArray.length; i++) {
								selectedItems.push.apply(selectedItems, addedHData.DataArray[i].HLevel);
								// selectedItems.length == 0 ? selectedItems=
								// addedHData.DataArray[i].HLevel
								// :selectedItems.concat(addedHData.DataArray[i].HLevel);
							}
						}

						for (var i = 0; i < this.hierarchyCBox.length; i++) {
							if (this.hierarchyCBox[i].getValue())
								selectedItems.push(this.hierarchyCBox[i].getValue());
						}

						var filteredResult = [];
						if (selectedItems.length == 0) {
							filteredResult = this.ListItems;
						} else {

							for (var i = 0; i < this.ListItems.length; i++) {
								if ($.inArray(this.ListItems[i].getText(), selectedItems) < 0)
									filteredResult.push(this.ListItems[i]);
							}

							// filteredResult =
							// this.ListItems.filter($.proxy(function(element){
							// selectedItems.find(function(selItem){
							// if(element == selItem)
							// return false;
							// return true;
							// })
							// } ,this))
						}

						for (var i = 0; i < this.hierarchyCBox.length; i++) {
							this.hierarchyCBox[i].removeAllItems();
							for (var j = 0; j < filteredResult.length; j++)
								this.hierarchyCBox[i].addItem(filteredResult[j].clone());
						}
					},

					_addItemsToCBox : function(cBox, selectedText) {
						for (var i = 0; i < this.ListItems.length; i++) {
							if (this.ListItems[i].getText() != selectedText) {
								cBox.addItem(this.ListItems[i].clone());

							}
						}
					}

				// onExit: function() {
				//
				// }
				});
