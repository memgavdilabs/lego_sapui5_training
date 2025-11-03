import cds from "@sap/cds";

export default async function addToCartHandler(req: cds.Request) {
    if(!req.data || !req.data.productId || !req.data.quantity || !req.data.userId) {
        req.reject(400, "Missing Input Data");
    }
}                           