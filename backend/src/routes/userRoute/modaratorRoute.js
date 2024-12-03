import { Router } from "express";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";
import {
  blockUnblockUserController,
  updateUserRoleController,
} from "../../controllers/userController/modaratorController.js";

const modaratorRoute = Router();

// admin
modaratorRoute.get("/admin/update-user-role", updateUserRoleController);
modaratorRoute.post("/admin/block-unblock-user", blockUnblockUserController);
modaratorRoute.post("/user/reported/:contentId");

modaratorRoute.get("/:userType/get-reported-content");
modaratorRoute.post("/:userType/content-removed/:contentId");

export default modaratorRoute;
