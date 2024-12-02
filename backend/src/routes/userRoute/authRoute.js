import { Router } from "express";
import {
  deleteAccountController,
  getAccessTokenController,
  loginController,
  registerController,
} from "../../controllers/userController/authController.js";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";

const authRoute = Router();

authRoute.post("/user/register", registerController);
authRoute.post("/user/login", loginController);
authRoute.delete(
  "/user/delete-account",
  accessTokenValidation,
  deleteAccountController
);
authRoute.post("/user/get-access-token", getAccessTokenController);

export default authRoute;
