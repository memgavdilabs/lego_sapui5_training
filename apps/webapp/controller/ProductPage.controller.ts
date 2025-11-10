import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { Route$MatchedEvent, Route$PatternMatchedEventParameters } from "sap/ui/core/routing/Route";
import ObjectPageLayout from "sap/uxap/ObjectPageLayout";
import History from "sap/ui/core/routing/History";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Label from "sap/m/Label";
import RatingIndicator from "sap/m/RatingIndicator";
import TextArea from "sap/m/TextArea";
import Table from "sap/m/Table";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import Button from "sap/m/Button";
import { ButtonType } from "sap/m/library";

/**
 * @namespace com.gavdi.lego_sapui5_training.controller
 */

export interface ProductPageRouteParams {
  productID: string
}

export default class ProductPage extends BaseController {
  private _resourceBoundle: ResourceBundle;
  private _addRatingDialog: Dialog;

  public async onInit() {
		this._resourceBoundle = await this.getResourceBundle() as ResourceBundle
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

  async openAddRatingDialog() {
    const oView = this.getView()
    if (!this._addRatingDialog) {
      oView.setBusy(true)
			this._addRatingDialog = (await Fragment.load({
				id: oView.getId(),
				name: "com.gavdi.lego_sapui5_training.view.fragments.AddRatingDialog",
				controller: this,
			})) as Dialog;
			oView.addDependent(this._addRatingDialog);
    }
    
    oView.setBusy(false)
    this._addRatingDialog.open()
  }

  closeAddRatingDialog() {
    const ratingSrc = this.getView().byId('ratingRating') as RatingIndicator
    const ratingCommentSrc = this.getView().byId('ratingComment') as TextArea

    ratingSrc.setValue(0)
    ratingCommentSrc.setValue('')

    this._addRatingDialog.close()
  }

  async addRating(ev: Event) {
    const src = this.getView().byId('ProductPageLayout')
    const prodID = src.getBindingContext().getProperty('ID')
    const ratingSrc = this.getView().byId('ratingRating') as RatingIndicator
    const ratingCommentSrc = this.getView().byId('ratingComment') as TextArea

    const oModel = this.getView().getModel() as ODataModel
    const binding = oModel.bindContext('/RateProduct(...)')
    binding.setParameter("productId", prodID)
    binding.setParameter("userId", 'user1')
    binding.setParameter("rating", ratingSrc.getValue())
    binding.setParameter("comment", ratingCommentSrc.getValue())

    try {
      await binding.invoke()
      await binding.requestObject()

      this.getView().byId('ProductPageLayout').getElementBinding().refresh()

      MessageToast.show(this._resourceBoundle.getText('addRatingSuccess'));
    } catch (error) {
      MessageBox.error(this._resourceBoundle.getText('addRatingError'))
    }

    this.closeAddRatingDialog()
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
