import { ShoppingCart } from "#cds-models/LegoShopService";
import cds from "@sap/cds";

export default async function addToCartHandler(req: cds.Request) {
    if(!req.data || !req.data.productId || !req.data.quantity || !req.data.userId) {
        req.reject(400, "Missing Input Data");
    }

    const { productId, quantity, userId } = req.data;
    
    // Fetch the product details to check stock availability
    const product = await SELECT.one.from("Products").where({ ID: productId });
    if (!product) {
        req.reject(404, "Product Not Found");
    }
    
    if (product.stockAvailable < quantity) {
        req.reject(400, "Insufficient Stock");
    }
    
    // Get the user's cart
    let cart = await SELECT.one.from("ShoppingCart").where({ userId: userId }) as ShoppingCart;
    if (!cart) {
        // Create a new cart if it doesn't exist
        const results = await INSERT.into("ShoppingCart").entries({ userId: userId, totalAmount: 0, totalDiscount: 0 });
        const productId = [...results][0].ID;
        cart = await SELECT.one.from("ShoppingCart").where({ ID: productId }) as ShoppingCart;
    }

    // Add the product to the cart
    await INSERT.into("CartItems").entries({
        cart_ID: cart.ID,
        product_ID: productId,
        quantity: quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity
    });

    // Update the cart total amount
    const updatedTotal = cart.totalAmount! + (product.price * quantity);
    await UPDATE("ShoppingCart").set({ totalAmount: updatedTotal }).where({ ID: cart.ID });
    
    return { message: "Product added to cart successfully", cartId: cart.ID };

}                           