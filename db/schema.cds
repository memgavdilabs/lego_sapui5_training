using { cuid, managed } from '@sap/cds/common';

namespace lego.shop.db;

entity Products: cuid, managed {
    name: String(100);
    description: String(500);
    theme: String(50);          //can be changed to an enum
    pieceCount: Integer;
    price: Decimal(9, 2);
    stockAvailable: Integer;
    averageRating: Decimal(3, 2);
    ratings: Association to many Ratings on ratings.product = $self;
}

entity Ratings: cuid, managed {
    product: Association to Products;
    userId: String(50);
    rating: Integer @assert.range: [0,5];
    comment: String(100);
}

entity DiscountRules: cuid {
    promoCode: String(10);
    discountPercent: Integer;
}

entity ShoppingCart: cuid, managed {
    userId: String(50);
    items: Association to many CartItems on items.cart = $self;
    totalAmount: Decimal(9, 2) @readonly;
    totalDiscount: Decimal(9, 2) @readonly;
}

entity CartItems: cuid, managed {
    cart: Association to ShoppingCart;
    product: Association to Products;
    quantity: Integer;
    unitPrice: Decimal(9, 2);   //snapshot of product price
    lineTotal: Decimal(9, 2) @readonly;
}