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
import Input from "sap/m/Input";
import Table from "sap/m/Table";

/**
 * @namespace com.gavdi.lego_sapui5_training.controller
 */
export default class Main extends BaseController {
	private _cartPopover: Popover;
	private _resourceBoundle: ResourceBundle;

	public async onInit() {
		this._resourceBoundle = await this.getResourceBundle() as ResourceBundle
	}

	onAfterRendering(): void | undefined {
		this.getShoppingCartPath()
	}

	navToProduct(ev: Event) {
		const listItem: ListItem = ev.getSource()
		const prodContext = listItem.getBindingContext()
		const prodID = prodContext.getProperty('ID')
		this.getRouter().navTo("ProductPage", { productID: prodID })
	}

	navToProductFromCart(ev: Event) {
		const listItem: ListItem = ev.getSource()
		const prodContext = listItem.getBindingContext()
		const prodID = prodContext.getProperty('product/ID')
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
		src.getElementBinding() && this._cartPopover.bindElement(src.getElementBinding().getPath());
		this._cartPopover.openBy(src, true)
	}

	async addToCart(ev: Event) {
		const src: Button = ev.getSource()
		const prodID = src.getBindingContext().getProperty('ID')

		const binding = this.getMainModel().bindContext('/AddToCart(...)')
		binding.setParameter("productId", prodID)
		binding.setParameter("userId", 'user1')
		binding.setParameter("quantity", 1)

		try {
			await binding.invoke()
			await binding.requestObject()
			const cartBtn = this.getView().byId('cartButton') as Button

			if (!cartBtn.getElementBinding()) {
				this.getShoppingCartPath()
			} else {
				cartBtn.getElementBinding().refresh()
			}

			MessageToast.show(this._resourceBoundle.getText('AddToShoppingCartSuccess'));
		} catch (error) {
			MessageBox.error(this._resourceBoundle.getText('AddToShoppingCartError'))
		}
	}

	async getShoppingCartPath() {
		const resultsContext = this.getModel()
			.bindContext(`/ShoppingCart`, null, {
				mode: "OneTime",
				$filter: "userId eq 'user1'"
			})
			.getBoundContext() as Context;

		resultsContext.requestObject().then((resultObj) => {
			if (resultObj.value.length > 0) {
				const cartBtn = this.getView().byId('cartButton') as Button
				cartBtn.bindElement(`/ShoppingCart(${resultObj.value[0].ID})`)
			}
		})

	}

	async submitDiscount() {
		const discountInput = this.getView().byId('discountCodeInput') as Input
		const discountCode = discountInput.getValue()

		if(!discountInput.getBindingContext()){
			MessageBox.error(this._resourceBoundle.getText('addItemsFirstMsg'))
			return;
		}

		if(!discountCode){
			discountInput.setValueState('Error')
			discountInput.setValueStateText(this._resourceBoundle.getText('fieldEmptyMsg'))
			return;
		}

		try {
			const binding = this.getMainModel().bindContext('/ApplyPromo(...)')
			binding.setParameter("promoCode", discountCode)
			binding.setParameter("shoppingCartId", discountInput.getBindingContext().getProperty('ID'))
			await binding.invoke()
			await binding.requestObject()
			discountInput.setValueState('Success');
			this._cartPopover.getElementBinding().refresh()
		} catch (error: any) {
			discountInput.setValueState('Error')
			discountInput.setValueStateText(error.message)
		}
	}

	getMainModel() {
		return this.getView().getModel() as ODataModel
	}
}
