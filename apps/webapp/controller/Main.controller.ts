import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import ListItem from "sap/ui/core/ListItem";
import Context from "sap/ui/model/odata/v4/Context";
import Button from "sap/m/Button";
import Popover from "sap/m/Popover";
import Fragment from "sap/ui/core/Fragment";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MessageToast from "sap/m/MessageToast";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Input from "sap/m/Input";

/**
 * @namespace com.gavdi.lego_sapui5_training.controller
 */
export default class Main extends BaseController {
	private _cartPopover: Popover;
	private _resourceBoundle: ResourceBundle;

	public onInit() {
		(this.getResourceBundle() as Promise<ResourceBundle>).then((resourceBoundle) => { this._resourceBoundle = resourceBoundle })
	}

	onAfterRendering() {
		this.getShoppingCartPath()
	}

	/**
	 * Navigate to product page when pressed from main page table
	 * @param ev List item press event
	 */
	navToProduct(ev: Event) {
		const listItem: ListItem = ev.getSource()
		const prodContext = listItem.getBindingContext()
		const prodID = prodContext.getProperty('ID')
		this.getRouter().navTo("ProductPage", { productID: prodID })
	}

	/**
	 * Navigate to product page when pressed from the cart
	 * @param ev List item press event
	 */
	navToProductFromCart(ev: Event) {
		const listItem: ListItem = ev.getSource()
		const prodContext = listItem.getBindingContext()
		const prodID = prodContext.getProperty('product/ID')
		this.getRouter().navTo("ProductPage", { productID: prodID })
	}

	/**
	 * Open cart popover by the cart button
	 * @param ev Button press event
	 */
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

		// Set the binding to the cart of user1
		src.getElementBinding() && this._cartPopover.bindElement(src.getElementBinding().getPath());
		this._cartPopover.openBy(src, true)
	}

	/**
	 * Add to cart action call. Calls the backend and returns either success or error
	 * @param ev Button press event
	 */
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

	/**
	 * Find the shopping cart path based on user1 user ID
	 */
	async getShoppingCartPath() {
		const resultsContext = this.getModel()
			.bindContext(`/ShoppingCart`, null, {
				mode: "OneTime",
				$filter: "userId eq 'user1'"
			})
			.getBoundContext() as Context;

		resultsContext.requestObject().then((resultObj) => {
			// check if shopping cart has been found (it might have not been created yet)
			if (resultObj.value.length > 0) {
				const cartBtn = this.getView().byId('cartButton') as Button
				// there will be always one shopping cart per user
				cartBtn.bindElement(`/ShoppingCart(${resultObj.value[0].ID})`)
			}
		})

	}

	/**
	 * Submit discount action call. Calls the backend and returns either success or error
	 */
	async submitDiscount() {
		const discountInput = this.getView().byId('discountCodeInput') as Input
		const discountCode = discountInput.getValue()

		// Check if shopping cart is bound. If not, then there is nothing to apply discount on
		if(!discountInput.getBindingContext()){
			MessageBox.error(this._resourceBoundle.getText('addItemsFirstMsg'))
			return;
		}

		// Check if user has input a discount code
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

	/**
	 * Simply get function for easier access of main data model
	 * This way you do not need to specifcy the type (ODataModel) every time
	 * @returns main model : ODataModel
	 */
	getMainModel() {
		return this.getView().getModel() as ODataModel
	}
}
