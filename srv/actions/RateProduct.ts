import cds from "@sap/cds";

export default async function rateProductHandler(req: cds.Request) {
    if(!req.data || !req.data.productId || !req.data.userId || !req.data.rating) {
        req.reject(400, "Missing Input Data");
    }
}