import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { Route$MatchedEvent, Route$PatternMatchedEventParameters } from "sap/ui/core/routing/Route";
import ObjectPageLayout from "sap/uxap/ObjectPageLayout";
import History from "sap/ui/core/routing/History";

/**
 * @namespace com.gavdi.lego_sapui5_training.controller
 */

export interface ProductPageRouteParams {
  productID: string
}

export default class ProductPage extends BaseController {
  private _resourceBoundle: ResourceBundle;

  public onInit() {
    this._resourceBoundle = this.getResourceBundle() as ResourceBundle
    this.getRouter()
      .getRoute("ProductPage")
      .attachPatternMatched(this.onPatternMatched, this);
  }

  async onPatternMatched(event: Route$MatchedEvent) {
    const params = event.getParameter('arguments') as ProductPageRouteParams
    if (params && params.productID) {
      const productPageLayout = this.getView().byId('ProductPageLayout')
      productPageLayout.bindElement(`/Products(${params.productID})`)
    }
  }

  onNavBackPressed() {
    const oHistory = History.getInstance();
    const sPreviousHash = oHistory.getPreviousHash();

    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("main", {}, true);
    }
  }
}
