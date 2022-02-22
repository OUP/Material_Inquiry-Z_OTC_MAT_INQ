sap.ui.controller("oup.otc.zotcmatinq.ext.controller.ListReportExt", {
  onBeforeRebindTableExtension: function (oEvent) {
    var oSmartTable = oEvent.getSource();
    var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
    var oFilterItems = oSmartFilterBar.getContent()[0].getContent();

    var aFlag = false;
    for (var i = 1; i < oFilterItems.length; i++) {
      var len = oFilterItems[i].getContent()[1].getTokens().length;
      if (len > 0 && i > 3) {
        aFlag = true;
      }
    }
    if (aFlag) {
    } else {
      sap.m.MessageBox.error("Please enter at least one selection");
      throw "Error";
    }
  },
  onInit: function () {
    _sIdPrefix =
      "oup.otc.zotcmatinq::sap.suite.ui.generic.template.ListReport.view.ListReport::ZOTC_C_MAT_INQ--";
  },
  onAfterRendering: function () {
    const oContentTable = this.byId(_sIdPrefix + "GridTable");
    oContentTable.attachBusyStateChanged(this._onBusyStateChanged);
  },
  _onBusyStateChanged: function (oEvent) {
    const bBusy = oEvent.getParameter("busy");
    if (!bBusy) {
      const oTable = oEvent.getSource();
      let oTpc = null;
      // grid table
      if (sap.ui.table.TablePointerExtension) {
        oTpc = new sap.ui.table.TablePointerExtension(oTable);
      } else {
        oTpc = new sap.ui.table.extensions.Pointer(oTable);
      }
      // columns
      const aColumns = oTable.getColumns();
      for (let i = aColumns.length; i >= 0; i--) {
        oTpc.doAutoResizeColumn(i);
      }
    }
  },
});
