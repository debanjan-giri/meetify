import { Router } from "express";

const userRoute = Router();

// user
userRoute.post("/details-update", token);
userRoute.get("/get-details/:Id", token);
userRoute.get("/submit-unsubmit-photoUrl", token);
userRoute.post("/get-my-details", token);
userRoute.post("/user-list?cursor=abc123&limit=5", token);
userRoute.post("/handle-connection", token);
userRoute.post("/connection-request-list", token);
userRoute.post("/sumbit-unsubmit-report", token);
export default userRoute;
