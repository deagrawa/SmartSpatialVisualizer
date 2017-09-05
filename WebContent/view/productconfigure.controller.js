sap.ui
		.controller(
				"sap.ui.usage.analytics.view.productconfigure",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf view.productconfigure
					 */
					onInit : function() {
						sap.ui.getCore().getEventBus().subscribe("Master", "ProductConfigure",
								this.initializeProductData, this);
						sap.ui.getCore().getEventBus().subscribe("Master", "OnProductConfigureNav", this.onNavBackInit,
								this);
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "productData");
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "formulaData");
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "columnData");
						this.getView().setModel(new sap.ui.model.json.JSONModel(), "AggData");

						this.getView().getModel("AggData").setData({
							Detail : [ {
								AggType : "COUNT"
							}, {
								AggType : "SUM"
							}, {
								AggType : "MAX"
							}, {
								AggType : "MIN"
							} ]
						});

						var dataTypeData = this.getOwnerComponent().getModel();
						var metadata = dataTypeData.getServiceMetadata().dataServices.schema[0].entityType[2].property;
						this.getView().getModel("columnData").setData({
							columns : metadata
						});

						sap.ui.core.UIComponent.getRouterFor(this)
								.attachRouteMatched("test", this.onRouteMatched, this);
						// this.initializeProductData();
						// / Qucik View

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
							text : " {productData>/Detail/PRODUCTNAME}",

							width : "300px",
						});
						var c = new sap.ui.commons.Label({
							text : "ProductId",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold

						});
						var d = new sap.m.Text({
							text : " {productData>/Detail/APPLICATIONID}",

							width : "300px",
						});
						var e = new sap.ui.commons.Label({
							text : "Product PortFolio",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold

						});

						var f = new sap.m.Text(
								{
									text : " {productData>/Detail/PORTFOLIOLEVEL1}//{productData>/Detail/PORTFOLIOLEVEL2}//{productData>/Detail/PORTFOLIOLEVEL3}",

									width : "300px",
								});

						var g = new sap.ui.commons.Label({
							text : "Adminstrator",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold
						});

						var h = new sap.m.Text({
							text : "{productData>/Detail/RESPONSIBLE}",
							width : "300px",

							wrapping : true
						});

						var i = new sap.ui.commons.Label({
							text : "Administrator(Substitute)",
							width : "150px",
							design : sap.ui.commons.LabelDesign.Bold

						});

						var j = new sap.m.Text({
							text : "{productData>/Detail/RESPONSIBLE_S}",

							width : "300px",
						});

						var oLayout1 = new sap.ui.layout.HorizontalLayout("Layout1", {
							content : [ a, b ]
						});
						var oLayout2 = new sap.ui.layout.HorizontalLayout("Layout2", {
							content : [ c, d ]
						});
						var oLayout3 = new sap.ui.layout.HorizontalLayout("Layout3", {
							content : [ e, f ]
						});
						var oLayout4 = new sap.ui.layout.HorizontalLayout("Layout4", {
							content : [ g, h ]
						});
						var oLayout5 = new sap.ui.layout.HorizontalLayout("Layout5", {
							content : [ i, j ]
						});

						qview.addContent(oLayout1).addContent(oLayout2).addContent(oLayout3).addContent(oLayout4)
								.addContent(oLayout5);
						// this.getView().byId("productLabelId").setTooltip(qview.clone());
						this.getView().byId("productNameTextId").setTooltip(qview.clone());
						// this.getView().byId("productidlabelid").setTooltip(qview.clone());
						this.getView().byId("productIdTextId").setTooltip(qview.clone());

					},

					initializeProductData : function(oChannel, oCaller, oData) {
						this.d = /^[a-zA-Z0-9_]+$/;
						this.getOwnerComponent().showHideMasterPage(this.getView(), false);
						this.editCustomKeyName = "";

						var oTable = this.getView().byId("configurationTable");
						oTable.destroyItems();
						this.getView().getModel("productData").setData({
							Detail : oData
						});

						this.onClear();
						this.addTableData();
					},

					onRouteMatched : function(evt) {
						if ("productconfigure" !== evt.getParameter("name")) {
							return;
						}

						return;
						var applicationid = evt.getParameter("arguments").id;

						sData = this.getView().getModel().getData().DataArray;
						var pathId = "";
						if (!sData)
							return;
						for (var i = 0; i < sData.length; i++) {
							if (sData[i].applicationid == applicationid) {
								pathId = i;
								break;
							}
						}

						var sProductPath = "/DataArray/" + pathId;
						var prodData = this.getView().getModel().getProperty(sProductPath);
						if (prodData) {
							this.getView().getModel("productData").setData({
								Detail : prodData
							});
						}

					},

					radiomeasureevent : function() {
						var x = this.getView().byId("measureradioid").getSelected();
						if (x == true) {
							this.getView().byId("aggregationcomboid").setEnabled(true);
						} else {
							this.getView().byId("aggregationcomboid").setEnabled(false);
						}
						this
								.getOwnerComponent()
								.sendUsageTracking(
										'{"View":"Registration","Action":"CustomConfiguration","SubAction1":"MeasureSelected"}');

					},

					radioattributeevent : function() {
						var x = this.getView().byId("attributeRadioBtnId").getSelected();
						if (x == true) {
							this.getView().byId("aggregationcomboid").setEnabled(false);
						} else {
							this.getView().byId("aggregationcomboid").setEnabled(true);
						}
						this
								.getOwnerComponent()
								.sendUsageTracking(
										'{"View":"Registration","Action":"CustomConfiguration","SubAction1":"AttributeSelected"}');
					},

					onClear : function() {
						this.getView().getModel("formulaData").setData({
							"ID" : "",
							"CustomKeyDataTypeID" : "",
							"CustomKeyDataLength" : 2000,
							"CustomKeyDisplayLabel" : "",
							"CustomKeyDisplayOrder" : "",
							"CustomKeyAnalyticTypeID" : 1,
							"FormulaeSupported" : 1,
							"DefaultAggregation" : "",
							"ConstraintID" : "1",
							"Formula" : "",
							"HierarchyName" : "",
							"HierarchyLevel" : ""
						});

						var dataTypeCBox = this.getView().byId("cBoxId");
						if (dataTypeCBox) {
							dataTypeCBox.setSelectedKey("");
						}

						var AggCBox = this.getView().byId("aggregationcomboid");
						if (AggCBox) {
							AggCBox.setSelectedKey("COUNT");
						}

						this.setCheckboxes();
						// this.getView().byId("attributeRadioBtnId").setSelected(true);
						this.getView().byId("columnDetailsSearchId").setValue(" ");
						this.getView().byId("formulaSearchId").setValue(" ");
						this.getView().byId("formulapanelid").setExpanded(false);
						this.getView().byId("columnDetailsSearchId").clear();
						this.getView().byId("formulaSearchId").clear();
						this.getView().byId("addbtn").setText("Add");
						this.getView().byId("abortBtn").setVisible(false);
						this.editCustomKeyName = "";
					},
					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf view.productconfigure
					 */
					onBeforeRendering : function() {
						// OnInit();
					},
					/**
					 * Called when the View has been rendered ( so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf view.productconfigure
					 */
					onAfterRendering : function() {

						var dataTypeData = this.getOwnerComponent().getModel();
						var metadata = dataTypeData.getServiceMetadata().dataServices.schema[0].entityType[2].property;
						this.getView().getModel("columnData").setData({
							columns : metadata
						});

						this.getView().byId("productLabelId").addStyleClass("textAlign");
						this.getView().byId("productidlabelid").addStyleClass("textAlign");

						var prodLabelArray = $('.textAlign');
						for (var i = 0; i < prodLabelArray.length; i++) {
							$('.textAlign')[i].setAttribute("class", "textAlign");
						}

					},

					onCancel : function() {
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							// this.getRouter().navTo("addProduct",{
							applicationid : "AddProduct",
							product : "AddProduct",
							from : "productConfigure",
							currentView : this.getView(),
							targetViewName : "sap.ui.usage.analytics.view.AddProduct",
							targetViewType : "XML",
							transition : "slide",
							name : "AddProduct",
						});

						this.getOwnerComponent().showHideMasterPage(this.getView(), true);

					},

					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf view.productconfigure
					 */
					// onExit: function() {
					//
					// }
					onProceed : function() {

						var prodData = this.getView().getModel("productData").getData("Details").Detail;

						// if ( (!prodData.DataArray)||(prodData.DataArray &&
						// prodData.DataArray.length == 0) ) {

						// sap.ui.core.UIComponent.getRouterFor(this).navTo("productHierarchy",
						// {
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							applicationid : "productHierarchy",
							product : "productHierarchy",
							from : "productconfigure",
							currentView : this.getView(),
							targetViewName : "sap.ui.usage.analytics.view.productHierarchy",
							targetViewType : "XML",
							transition : "slide"
						});

						this.getOwnerComponent().showHideMasterPage(this.getView(), false);

						sap.ui.getCore().getEventBus().publish("Master", "ProductHierarchyLoad", prodData);

					},

					productSaveSucceed : function() {
						arguments[1].messageDisplay("Product added successfully", "Success",
								sap.m.MessageBox.Icon.SUCCESS);
						this.getOwnerComponent().sendUsageTracking(
								'{"View":"Registration","Action":"CustomConfiguration","SubAction1":"ProductAdded"}');
					},

					productSaveFail : function() {
						arguments[1].messageDisplay(arguments[0]);
					},

					getOwnerComponent : function() {
						var v = sap.ui.core.Component.getOwnerIdFor(this.getView());
						if (v === undefined) {
							return undefined
						}
						return sap.ui.component(v);
					},

					columnListPress : function(oData) {
						var txtArea = this.getView().byId("FormulaTextArea");
						var txt = txtArea.getValue();
						txtArea.setValue(txt + "test");
					},

					onColumnItemPress : function(oEvent) {
						var columnValue = oEvent.oSource.getSelectedItem().getTitle();

						var value = "[" + columnValue + "]";
						var formulaData = this.getView().getModel("formulaData").getData();
						var formulaText = formulaData.Formula;

						var selectedIndex = this.getView().byId("FormulaTextArea").getFocusInfo().selectionStart;
						/*
						 * for(i=0;i<formulaText.length;i++) {
						 * if(i==selectedindex) { for(j=0;j<value.length;j++) {
						 * formulaText[selectedindex]=value[j]; selectedindex++; }
						 * break; } }
						 */
						/*var subString1 = formulaText.substring(0, selectedIndex);
						var subString2 = formulaText.substring(selectedIndex, formulaText.length);
						var formulaText = subString1 + value +subString2;*/
						formulaText=formulaText.slice(0,selectedIndex) +value + formulaText.slice(selectedIndex ,formulaText.length);

						//m.selectionStart = selectedIndex + (formulaText.length);

						var formulaName = formulaData.CustomKeyName;
						var formulaDataType = formulaData.CustomKeyDataTypeID;
						var formulaLength = formulaData.CustomKeyDataLength;
						var label = formulaData.CustomKeyDisplayLabel;

						this.getView().getModel("formulaData").setData({
							Formula : formulaText ? formulaText : "[" + columnValue + "]",
							CustomKeyName : formulaName,
							CustomKeyDataTypeID : formulaDataType,
							CustomKeyDataLength : formulaLength,
							CustomKeyDisplayLabel : label,
							DefaultAggregation : formulaData.DefaultAggregation
						});
					},

					onFormulaChange : function(oEvent) {
						this
								.getOwnerComponent()
								.sendUsageTracking(
										'{"View":"Registration","Action":"CustomConfiguration","SubAction1":"FormulaSelected"}');
						var columnValue = oEvent.oSource.getSelectedItem().getTitle();
						var formulaData = this.getView().getModel("formulaData").getData();

						var formulaText = formulaData.Formula;

						var selectedIndex = this.getView().byId("FormulaTextArea").getFocusInfo().selectionStart;
						/*
						 * var subString1 = formulaText.substring(0,
						 * selectedIndex); var subString2 =
						 * formulaText.substring(selectedIndex,
						 * formulaText.length); var formulaText =subString1 +
						 * columnValue + subString2;
						 */
						formulaText = formulaText.slice(0, selectedIndex) + columnValue
								+ formulaText.slice(selectedIndex, formulaText.length);
						var formulaName = formulaData.CustomKeyName;
						var formulaDataType = formulaData.CustomKeyDataTypeID;
						var formulaLength = formulaData.CustomKeyDataLength;
						var label = formulaData.CustomKeyDisplayLabel;

						this.getView().getModel("formulaData").setData({
							Formula : formulaText ? formulaText : columnValue,
							CustomKeyName : formulaName,
							CustomKeyDataTypeID : formulaDataType,
							CustomKeyDataLength : formulaLength,
							CustomKeyDisplayLabel : label,
							DefaultAggregation : formulaData.DefaultAggregation
						});
					},

					onSelect : function(oEvent) {
						var columnValue = oEvent.oSource.getSelectedItem().getTitle();
					},

					onColumnSearch : function() {
						// add filter for search
						var filters = [];
						var searchString = this.getView().byId("columnDetailsSearchId").getValue();
						var searchstring1 = searchString.toUpperCase();
						if (searchString && searchString.length > 0) {
							filters = [ new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains,
									searchstring1) ];
						}

						// update list binding
						this.getView().byId("columnList").getBinding("items").filter(filters);
					},

					onFormulaSearch : function() {
						this.getOwnerComponent().sendUsageTracking(
								'{"View":"Registration","Action":"CustomConfiguration","SubAction1":"FormulaSearch"}');
						// add filter for search
						var filters = [];
						var searchString = this.getView().byId("formulaSearchId").getValue();
						var searchstring1 = searchString.toLowerCase();
						if (searchString && searchString.length > 0) {
							filters = [ new sap.ui.model.Filter("FORMULANAME", sap.ui.model.FilterOperator.Contains,
									searchstring1) ];
						}

						// update list binding
						this.getView().byId("idList2").getBinding("items").filter(filters);
					},

					getAggregationType : function() {
						var aggregation = "";
						if ((this.getView().byId("countid").getSelected()) == true) {
							aggregation = "COUNT,";
						}
						if ((this.getView().byId("distinctcountid").getSelected()) == true) {
							aggregation = aggregation + "DISTINCTCOUNT,";
						}
						if ((this.getView().byId("sumid").getSelected()) == true) {
							aggregation = aggregation + "SUM,";
						}
						if ((this.getView().byId("maxid").getSelected()) == true) {
							aggregation = aggregation + "MAX,";
						}
						if ((this.getView().byId("minid").getSelected()) == true) {
							aggregation = aggregation + "MIN,";
						}

						if (aggregation && aggregation != "") {
							aggregation = aggregation.substring(0, (aggregation.length - 1));
						}

						return aggregation;
					},

					onAdd : function() {

						// fix for dataType value not updating in model first
						// time
						var formulaData = this.getView().getModel("formulaData").getData();
						formulaData.CustomKeyDataTypeID = this.getView().byId("cBoxId").getValue();

						if (!this.validateInput())
							return;
						this.getOwnerComponent().sendUsageTracking(
								'{"View":"Registration","Action":"CustomConfiguration","SubAction1":"CustomKeyAdded"}');
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData({
							"rows" : formulaData
						});

						if (this.getView().getModel("productData").getData("Details").Detail.DataArray)
							formulaData.ID = this.getView().getModel("productData").getData("Details").Detail.DataArray.length + 1;
						else
							formulaData.ID = 1;

						formulaData.ConstraintID = 1;
						formulaData.FormulaeSupported = 1;

						var prodData = this.getView().getModel("productData").getData("Details").Detail;

						var columnData = this.getView().getModel("columnData").getData();
						columnData.columns.push({
							COLUMN_NAME : formulaData.CustomKeyName
						});
						this.getView().getModel("columnData").refresh();

						if (!prodData.DataArray)
							prodData.DataArray = [];

						if (this.editCustomKeyName == "") {
							prodData.DataArray.push(formulaData);
						} else {
							for (var i = 0; i < prodData.DataArray.length; i++) {
								if (prodData.DataArray[i].CustomKeyName == this.editCustomKeyName) {
									prodData.DataArray[i] = formulaData;
									break;
								}
							}
						}

						var aggType = this.getAggregationType();
						this.getView().getModel("formulaData").getData().DefaultAggregation = aggType;
						if (aggType == "") {
							this.getView().getModel("formulaData").getData().CustomKeyAnalyticTypeID = 2;
						} else {
							this.getView().getModel("formulaData").getData().CustomKeyAnalyticTypeID = 3;
						}

						this.addTableData();
						this.onClear();
						this.getView().getModel("productData").refresh();
						// this.getView().getModel("formulaData").setData({
						// formulaname : "test"
						// });
					},

					setCheckboxes : function() {
						this.getView().byId("sumid").setEnabled(false);
						this.getView().byId("minid").setEnabled(false);
						this.getView().byId("maxid").setEnabled(false);
						this.getView().byId("distinctcountid").setEnabled(false);
						this.getView().byId("countid").setEnabled(false);
						this.getView().byId("sumid").setSelected(false);
						this.getView().byId("minid").setSelected(false);
						this.getView().byId("maxid").setSelected(false);
						this.getView().byId("distinctcountid").setSelected(false);
						this.getView().byId("countid").setSelected(false);
					},

					onDataTypeSelect : function() {
						this.setCheckboxes();

						var selectedDataType = this.getView().byId('cBoxId').getValue();
						if (!selectedDataType)
							return;

						if (selectedDataType === 'VARCHAR') {
							this.getView().byId("countid").setEnabled(true);
							this.getView().byId("distinctcountid").setEnabled(true);

						} else if (selectedDataType === 'TIMESTAMP') {
							this.getView().byId("minid").setEnabled(true);
							this.getView().byId("maxid").setEnabled(true);

						} else if (selectedDataType === 'INT' || selectedDataType === 'DECIMAL') {
							this.getView().byId("minid").setEnabled(true);
							this.getView().byId("maxid").setEnabled(true);
							this.getView().byId("sumid").setEnabled(true);
							this.getView().byId("distinctcountid").setEnabled(true);
							this.getView().byId("countid").setEnabled(true);
						}
					},

					onNavBackInit : function(oChannel, oCaller, oData) {
						this.getView().getModel("productData").setData({
							Detail : oData
						});
					},

					onNavBack : function() {
						var formattedData = this.getView().getModel("productData").getData().Detail;
						sap.ui.getCore().getEventBus().publish("Master", "ProductEdit", formattedData);

						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							// this.getRouter().navTo("addProduct",{
							applicationid : "AddProduct",
							product : "AddProduct",
							from : "productconfigure",
							currentView : this.getView(),
							targetViewName : "sap.ui.usage.analytics.view.AddProduct",
							targetViewType : "XML",
							transition : "slide",
							name : "AddProduct",
						});

						this.getOwnerComponent().showHideMasterPage(this.getView(), true);
					},

					addTableData : function(data) {
						var oTable = this.getView().byId("configurationTable");
						var tData = oTable.getModel("productData").getData("Details").Detail.DataArray;
						var aColumnData = [ {
							columnId : "formulaName"
						}, {
							columnId : "formulaDataType"
						}, {
							columnId : "formulaText"
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

						// var oTable = new sap.m.Table({});
						oTable.setModel(oModel);

						var that = this;
						oTable
								.bindItems(
										"/rows",
										function(index, context) {
											var rowObject = context.getObject();
											var row = new sap.m.ColumnListItem();

											row.addCell(new sap.m.Text({
												text : rowObject["CustomKeyName"]
											}));
											row.addCell(new sap.m.Text({
												text : rowObject["CustomKeyDataTypeID"]
											}));
											row.addCell(new sap.m.Text({
												text : rowObject["Formula"]
											}));
											row.addCell(new sap.m.Text({
												text : rowObject["CustomKeyDisplayLabel"]
											}));

											var editIcon = new sap.ui.core.Icon();
											editIcon.setSrc("sap-icon://edit")
											editIcon.attachPress(function(evt) {

												var formulaData = that.getView().getModel("formulaData").getData();

												formulaData.CustomKeyName = rowObject.CustomKeyName;
												formulaData.CustomKeyDataTypeID = rowObject.CustomKeyDataTypeID;
												formulaData.CustomKeyDataLength = rowObject.CustomKeyDataLength;
												formulaData.CustomKeyDisplayLabel = rowObject.CustomKeyDisplayLabel;
												formulaData.DefaultAggregation = rowObject.DefaultAggregation;
												formulaData.Formula = rowObject.Formula;
												that.getView().getModel("formulaData").refresh();
												var aggType = formulaData.DefaultAggregation;
												that.onDataTypeSelect();
												if (aggType && aggType.trim() != "") {
													aggType = aggType.split(',');
													for (var i = 0; i < aggType.length; i++) {
														var controlid = aggType[i].toLowerCase() + "id";
														that.getView().byId(controlid).setEnabled(true);
														that.getView().byId(controlid).setSelected(true);
													}
												}

												that.getView().getModel("formulaData").refresh();

												var addBtnText = that.getView().byId("addbtn");
												addBtnText.setText("Update");
												var abortBtn = that.getView().byId("abortBtn");
												abortBtn.setVisible(true);

												that.editCustomKeyName = rowObject.CustomKeyName;
												// deleting from table
												// but don;t

											});

											row.addCell(editIcon);
											var deleteIcon = new sap.ui.core.Icon();
											deleteIcon.setSrc("sap-icon://delete")
											deleteIcon
													.attachPress(function(evt) {
														var k = that.getView().getModel("productData").getData(
																"Details").Detail;

														for (var i = 0; i < k.DataArray.length; i++) {
															if (((rowObject && rowObject.CustomKeyName) === (k.DataArray[i] && k.DataArray[i].CustomKeyName))) {
																if (k.DataArray[i]
																		&& k.DataArray[i].CustomKeyName !== undefined) {
																	k.DataArray.splice(i, 1);
																	delete (rowObject);
																	evt.getSource().getParent().destroy();
																	break;
																}
															}
														}

														that.onClear();

													});

											row.addCell(deleteIcon);

											return row;
										});
					},

					validateInput : function() {
						var bResult = false;

						var dataArray = this.getView().getModel("productData").getData("Details").Detail.DataArray;
						var formulaData = this.getView().getModel("formulaData").getData();
						var cBox = this.getView().byId('cBoxId');
						if (!formulaData.CustomKeyName) {
							this.getOwnerComponent().messageDisplay("Name cannot be empty", "Incorrect Input");
						} else if (!(this.d.test(formulaData.CustomKeyName))) {
							this
									.getOwnerComponent()
									.messageDisplay(
											"Invalid configuration Name.[Only Alphanumeric and underscore characters are allowed ]",
											"Incorrect Input");
						} else if (!formulaData.CustomKeyDataTypeID) {
							this.getOwnerComponent().messageDisplay("Data Type cannot be empty", "Incorrect Input");
						} else if (!(this.d.test(formulaData.CustomKeyDataTypeID))) {
							this.getOwnerComponent().messageDisplay("Invalid datatype selected", "Incorrect Input");
						} else if (!(this.d.test(formulaData.CustomKeyDataTypeID))) {
							this.getOwnerComponent().messageDisplay("Invalid datatype selected", "Incorrect Input");
						} else if (((formulaData.CustomKeyDataTypeID === 'VARCHAR') && (formulaData.DefaultAggregation === 'SUM'))
								|| ((formulaData.CustomKeyDataTypeID === 'VARCHAR') && (formulaData.DefaultAggregation === 'MIN'))
								|| ((formulaData.CustomKeyDataTypeID === 'VARCHAR') && (formulaData.DefaultAggregation === 'MAX'))) {
							this.getOwnerComponent().messageDisplay("Aggregation type has to be count for VARCHAR",
									"Incorrect Input");
						} else if (((formulaData.CustomKeyDataTypeID === 'TIMESTAMP') && (formulaData.DefaultAggregation === 'SUM'))
								|| ((formulaData.CustomKeyDataTypeID === 'TIMESTAMP') && (formulaData.DefaultAggregation === 'COUNT'))
								|| ((formulaData.CustomKeyDataTypeID === 'TIMESTAMP') && (formulaData.DefaultAggregation === 'DISTINCTCOUNT'))) {
							this.getOwnerComponent().messageDisplay("Aggregation type has to be MIN/MAX for TIMESTAMP",
									"Incorrect Input");
						} else if (!this.getOwnerComponent().verifyCBoxValues(cBox)) {
							this.getOwnerComponent().messageDisplay("Incorrect value for Data Type", "Incorrect Input");
						} else {
							bResult = true;
						}

						if (dataArray && formulaData.CustomKeyName) {
							for (var i = 0; i < dataArray.length; i++) {
								// var customkeyUpperCase =
								// dataArray[i].CustomKeyName.toUpperCase();
								if ((dataArray[i].CustomKeyName.toUpperCase() == formulaData.CustomKeyName
										.toUpperCase())
										&& dataArray[i].CustomKeyName.toUpperCase() != this.editCustomKeyName
												.toUpperCase()) {
									this.getOwnerComponent().messageDisplay("Configuration Name Already Exist",
											"Incorrect Input");
									return false;
								}
							}
						}

						var message = {};
						var columns = formulaData.Formula.match(/[^[\]]+(?=])/g);
						if (columns && columns.length > 0) {
							var serviceParameter = {
								url : "./ViewCreationServlet?storyType=formulaValidation&formula="
										+ encodeURIComponent(formulaData.Formula.replace(/[\[\]]+/g, '"'))
										+ "&colNames=" + columns.toString(),
								type : "GET"
							};

						var that = this;
						var result = this.getOwnerComponent().sendData(serviceParameter, null, null, function() {
							if (arguments && arguments.length > 0 && arguments[0] == "FAILED") {
								that.getOwnerComponent().messageDisplay("Incorrect formula", "Incorrect Input");
								bResult = false;
								return false;
							}
						});
						}

						return bResult;
					}
				});
