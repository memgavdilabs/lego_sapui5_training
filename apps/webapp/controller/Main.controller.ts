import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import ListItem from "sap/ui/core/ListItem";
import Context from "sap/ui/model/odata/v4/Context";
import Button from "sap/m/Button";
import Popover from "sap/m/Popover";
import Fragment from "sap/ui/core/Fragment";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MessageToast from "sap/m/MessageToast";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace com.gavdi.lego_sapui5_training.controller
 */
export default class Main extends BaseController {
	private _cartPopover: Popover;
	private _resourceBoundle: ResourceBundle;

	public onInit() {
        this._resourceBoundle = this.getResourceBundle() as ResourceBundle
    }

	navToProduct(ev: Event) {
		const listItem: ListItem = ev.getSource()
		const prodContext = listItem.getBindingContext()
		const prodID = prodContext.getProperty('ID')
		this.getRouter().navTo("ProductPage", { productID: prodID })
	}

	async openCartPopover(ev: Event) {
		const src: Button = ev.getSource()
		const oView = this.getView()
		if (!this._cartPopover) {
			oView.setBusy(true)
			this._cartPopover = (await Fragment.load({
				id: oView.getId(),
				name: "com.gavdi.lego_sapui5_training.view.fragments.CartPopover",
				controller: this,
			})) as Popover;
			oView.addDependent(this._cartPopover);
		}
		oView.setBusy(false)
		this._cartPopover.openBy(src, true)
	}

	async addToCart(ev: Event) {
		const oView = this.getView()
		const src: Button = ev.getSource()
		const prodID = src.getBindingContext().getProperty('ID')

		const binding = this.getMainModel().bindContext('/AddToCart(...)')
		binding.setParameter("productId", prodID)
		binding.setParameter("userId", 'user1')
		binding.setParameter("quantity", 1)

		await binding.invoke()
		const resultObj = await binding.requestObject()
		console.log(resultObj)


		/*
		this.createEntry('/ShoppingCart', 'AddToShoppinCartGroup', {
			"productId": prodID,
			"userId": "user1",
			"quantity": 1
		})

		await this.getMainModel().submitBatch('AddToShoppinCartGroup')
		// Check if changes have been submitted
		if (this.getMainModel().hasPendingChanges('AddToShoppinCartGroup')) {
            oView.setBusy(false)
            MessageBox.error(this._resourceBoundle.getText('AddToShoppinCartGroup'))
        } else {
			MessageToast.show(this._resourceBoundle.getText('AddToShoppinCartGroup'));
		}*/
	}

	createEntry(sEntitySet: string, sUpdateGroup: string, oInitialData?: object, modelName? : string): Context {
		let oModel;
		if(modelName){
			oModel = this.getModel(modelName)
		} else {
			oModel = this.getModel()
		}
		const oBinding = oModel.bindList(sEntitySet, undefined, undefined, undefined, {
			$$updateGroupId: sUpdateGroup,
		}) as ODataListBinding;

		let oContext: Context;
		if (oInitialData) {
			oContext = oBinding.create(oInitialData);
		} else {
			oContext = oBinding.create();
		}
		return oContext;
	}

	getMainModel() {
		return this.getView().getModel() as ODataModel
	}
}
