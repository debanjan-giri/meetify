import { Router } from "express";

const moderatorRoute = Router();

// admin
moderatorRoute.post("/update-user-role");
moderatorRoute.post("/block-unblock-user");
moderatorRoute.get("/reported-list?limit=5&cursor=");
moderatorRoute.post("/content-removed");
moderatorRoute.post("/undo-reported-content");

export default moderatorRoute;
