import cds from "@sap/cds";

export default async function applyPromoHandler(req: cds.Request) {
    if(!req.data || !req.data.promoCode || !req.data.shoppingCartId) {
        req.reject(400, "Missing Input Data");
    }
}