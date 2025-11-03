
import cds from "@sap/cds";
import rateProductHandler from "./actions/RateProduct";
import applyPromoHandler from "./actions/ApplyPromo";
import addToCartHandler from "./actions/AddToCart";

export class LegoShopService extends cds.ApplicationService {
   init() {
    // add your custom service initialization logic here
    this.on("AddToCart", addToCartHandler);
    this.on("RateProduct", rateProductHandler);
    this.on("ApplyPromo", applyPromoHandler);

    return super.init();
  }
}