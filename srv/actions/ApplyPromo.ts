import cds from "@sap/cds";

export default async function applyPromoHandler(req: cds.Request) {
    if(!req.data || !req.data.promoCode || !req.data.shoppingCartId) {
        req.reject(400, "Missing Input Data");
    }

    const { promoCode, shoppingCartId } = req.data;

    // Fetch the promo details
    const promo = await SELECT.one.from("DiscountRules").where({ promoCode: promoCode });
    if (!promo) {
        req.reject(404, "Promo Code Not Found");
    }
    // Fetch the shopping cart
    const cart = await SELECT.one.from("ShoppingCart").where({ ID: shoppingCartId });
    if (!cart) {
        req.reject(404, "Shopping Cart Not Found. Add atleast 1 item to the cart before applying a promo code.");
    }

    // Calculate discount
    const discountAmount = (cart.totalAmount! * promo.discountPercent) / 100;
    const updatedTotal = cart.totalAmount! - discountAmount;

    // Update the shopping cart with discount
    await UPDATE("ShoppingCart").set({ 
        totalAmount: updatedTotal,
        totalDiscount: discountAmount
    }).where({ ID: shoppingCartId });

    return { 
        message: "Promo code applied successfully", 
        shoppingCartId: shoppingCartId, 
        newTotalAmount: updatedTotal, 
        discountApplied: discountAmount 
    };
}