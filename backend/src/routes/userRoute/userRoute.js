import { Router } from "express";
import {
  getUserDetailsController,
  suffledUserListController,
  upateDetailsController,
} from "../../controllers/userController/userController.js";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";

const userRoute = Router();

userRoute.post(
  "/user/update-my-details",
  accessTokenValidation,
  upateDetailsController
);

userRoute.get(
  "/user/get-my-details",
  accessTokenValidation,
  getUserDetailsController
);

userRoute.get(
  "/get-suffled-user-list",
  accessTokenValidation,
  suffledUserListController
);
userRoute.get("/mood-history");

// employee
userRoute.get("/employee-details/:userId");
userRoute.post("/employee/send-connection");
userRoute.post("/employee/accept-connection");
userRoute.get("/employee/request-connection");
userRoute.post("/employee/remove-connection");
userRoute.post("/employee/connection-list");

// admin
userRoute.get("/:userType/update-user-role");
userRoute.post("/:userType/block-user");
userRoute.post("/:userType/unblock-user");
userRoute.post("/:userType/reported/:contentId");
userRoute.get("/:userType/get-reported-content");
userRoute.post("/:userType/content-removed");

export default userRoute;
