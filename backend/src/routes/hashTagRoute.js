import { Router } from "express";

const hashTagRoute = Router();

// acc
hashTagRoute.post("/hashtag/acc-create");
hashTagRoute.delete("/hashtag/acc-delete");
hashTagRoute.post("/hashtag/get-all");

// post
hashTagRoute.get("/hashtag/create-content");
hashTagRoute.get("/hashtag/all-content");
hashTagRoute.get("/hashtag/content-details/:contentId");
hashTagRoute.get("/hashtag/content-delete/:contentId");

export default hashTagRoute;
