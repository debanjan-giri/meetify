import { Router } from "express";

const communityRoute = Router();

// acc
communityRoute.post("/community/acc-create");
communityRoute.delete("/community/acc-delete");
communityRoute.post("/community/get-all");

// post
communityRoute.get("/community/create-content");
communityRoute.get("/community/all-content");
communityRoute.get("/community/content-details/:contentId");
communityRoute.get("/community/content-delete/:contentId");

export default communityRoute;
