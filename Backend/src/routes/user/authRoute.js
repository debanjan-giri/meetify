import { Router } from "express";
import {
  deleteAccountController,
  getAccessTokenController,
  loginController,
  registerController,
} from "../../controllers/user/authController.js";
import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";

const authRoute = Router();

authRoute.post("/register", registerController);
authRoute.post("/login", loginController);
authRoute.post("/delete-account", verifyAccessToken, deleteAccountController);
authRoute.get("/get-access-token", getAccessTokenController);

export default authRoute;
