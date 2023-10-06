sap.ui.controller("oup.otc.zotcmatinq.ext.controller.ObjectPageExt", {
  onInit: function () {
    // attach page data loaded on odata callback with context as response
    this.getView()
      .getController()
      .extensionAPI.attachPageDataLoaded(async (oData) => {
        let sPath = oData.context.getPath();

        // get mat determination detail
        this.oMatDetails = await this.read(`${sPath}/to_minq`);
      });
  },

  ISBN: function (oEvent) {
    if (!this._ISBNAction) {
      this._ISBNAction = sap.ui.xmlfragment(
        "oup.otc.zotcmatinq.ext.fragment.ISBNActionSheet",
        this
      );
    }
    var oButton = oEvent.getSource();
    this._ISBNAction.openBy(oButton);
  },

  // on menu item selected
  onMenuItemSelected: async function (oEvent) {
    try {
      // start busy indicator
      sap.ui.core.BusyIndicator.show(0);

      const oSource = oEvent.getParameter("item");
      const semanticObject = oSource.data("SEMANTIC_OBJECT");
      const action = oSource.data("SEMANTIC_ACTION");
      const parm = oSource.data("PARM");
      var oData = this.getView().getBindingContext().getObject();

      // if no semantic object and action exit the menu selection
      if (semanticObject === "" && action === "") {
        return;
      }

      // posting date
      const sCurrentDateISO = new Date().toISOString();
      const sPostingDateISO = this.oMatDetails.PostDate.toISOString();

      // parms
      const oParams = {
        ISBN: {
          Product: oData.ISBN,
        },
        MAT_DET: {
          MatDetType: this.oMatDetails.MatDeterminationType || "",
        },
        BILL_DOCS: {
          Material: oData.ISBN,
        },
        PRC_COND: {
          ConditionType: this.oMatDetails.condtn_type,
        },
        DR: {
          Material: oData.ISBN,
          application: this.oMatDetails.DeliveryRestriction,
        },
        MR: {
          Material: oData.ISBN,
          application: this.oMatDetails.MarketRestriction,
        },
        SR: {
          Material: oData.ISBN,
          application: this.oMatDetails.StockRestriction,
        },
        PIR: {
          Material: oData.ISBN,
          // Plant: oData.Plant,
        },
        SETS: {
          Material: oData.ISBN,
          Plant: oData.Plant,
          BOMUsage: "1",
        },
        BUNDLES: {
          BOMComponentForEdit: oData.ISBN,
        },
        STOCK_OV: {
          Material: oData.ISBN,
        },
        STOCK_MOV: {
          Material: oData.ISBN,
          Plant: oData.Plant,
          GoodsMovementType: this.oMatDetails.MovementType,
          PostingDate: `${sCurrentDateISO}-${sPostingDateISO}`,
        },
        OPEN_POS: {
          Material: oData.ISBN,
          Plant: oData.Plant,
        },
        BACKORDER: {
          Material: oData.ISBN,
          SalesOrg: oData.SalesOrganization,
        },
        SALES_VDA: {
          Material: oData.ISBN,
        },
        CUST_RET: {
          Material: oData.ISBN,
        },
        ZPSR: {
          Product: oData.ISBN,
          Plant: oData.Plant,
          sorg: oData.SalesOrganization,
          distChanl: oData.DistributionChannel,
        },
      };

      var oCrossAppNavigator = sap.ushell.Container.getService(
        "CrossApplicationNavigation"
      );

      var hash =
        (oCrossAppNavigator &&
          oCrossAppNavigator.hrefForExternal({
            target: {
              semanticObject,
              action,
            },
            params: oParams[parm] || {},
          })) ||
        ""; // generate the Hash to display a Supplier

      oCrossAppNavigator.toExternal({
        target: {
          shellHash: hash,
        },
      }); // navigate to Supplier application
    } catch (error) {
      // no exception handled
    }

    // stop busy indicator
    sap.ui.core.BusyIndicator.hide();
  },

  fnStock: function (oEvent) {
    if (!this._StockAction) {
      this._StockAction = sap.ui.xmlfragment(
        "oup.otc.zotcmatinq.ext.fragment.StockActionSheet",
        this
      );
    }
    var oButton = oEvent.getSource();
    this._StockAction.openBy(oButton);
  },

  fnProduction: function (oEvent) {
    if (!this._ProductionAction) {
      this._ProductionAction = sap.ui.xmlfragment(
        "oup.otc.zotcmatinq.ext.fragment.ProductionActionSheet",
        this
      );
    }
    //  alert("ISBN");
    var oButton = oEvent.getSource();
    this._ProductionAction.openBy(oButton);
  },

  read: function (sPath) {
    return new Promise((resolve, reject) => {
      this.getView()
        .getModel()
        .read(sPath, {
          success: (oData) => resolve(oData),
          error: () => reject(),
        });
    });
  },
});
