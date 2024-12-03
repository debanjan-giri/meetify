import { Router } from "express";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";

const modaratorRoute = Router();

// admin
modaratorRoute.get("/:userType/update-user-role");
modaratorRoute.post("/:userType/block-user");
modaratorRoute.post("/:userType/unblock-user");
modaratorRoute.post("/:userType/reported/:contentId");
modaratorRoute.get("/:userType/get-reported-content");
modaratorRoute.post("/:userType/content-removed");

export default modaratorRoute;
