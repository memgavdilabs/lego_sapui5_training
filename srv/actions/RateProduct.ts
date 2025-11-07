import cds from "@sap/cds";

export default async function rateProductHandler(req: cds.Request) {
    if(!req.data || !req.data.productId || !req.data.userId || !req.data.rating) {
        req.reject(400, "Missing Input Data");
    }
    const { productId, userId, rating, comment } = req.data;

    await INSERT.into("Ratings").entries({
         product_ID: productId,
         userId: userId,
         rating: rating,
         comment: comment});
    
    //update the avg rating
    const result = await SELECT.one.from("Ratings").columns`avg(rating) as avgRating`.where({ product_ID: productId });

    await UPDATE("Products").set({ averageRating: result.avgRating }).where({ ID: productId});
}