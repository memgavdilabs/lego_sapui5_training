using { lego.shop.db as db } from '../db/schema';

service LegoShopService {
    entity Products as projection on db.Products;
    entity Ratings as projection on db.Ratings;
    entity ShoppingCart as projection on db.ShoppingCart;
    entity CartItems as projection on db.CartItems;
    entity DiscountRules as projection on db.DiscountRules;

    action AddToCart(productId: UUID, userId: String, quantity: Integer);
    action RateProduct(productId: UUID, userId: String, rating: Integer, comment: String);
    action ApplyPromo(shoppingCartId: UUID, promoCode: String);
}
