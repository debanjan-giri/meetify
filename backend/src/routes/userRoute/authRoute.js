import { Router } from "express";
import {
  deleteAccountController as deleteAccount,
  getAccessTokenController as getAccessToken,
  loginController as login,
  registerController as register,
} from "../../controllers/userController/authController.js";
import { accessTokenValidation as token } from "../../middleware/accessTokenValidation.js";

const authRoute = Router();

authRoute.post("/user/register", register);
authRoute.post("/user/login", login);
authRoute.delete("/user/delete-account", token, deleteAccount);
authRoute.get("/user/get-access-token", getAccessToken);

export default authRoute; 
