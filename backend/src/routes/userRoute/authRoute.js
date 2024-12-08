import { Router } from "express";
import {
  deleteAccountController as deleteAccount,
  getAccessTokenController as getAccessToken,
  loginController as login,
  registerController as register,
} from "../../controllers/userController/authController.js";
import { accessTokenValidation as token } from "../../middleware/accessTokenValidation.js";

const authRoute = Router();

// auth route
const { a, b, c, d } = {
  a: "/user/register",
  b: "/user/login",
  c: "/user/delete-account",
  d: "/user/get-access-token",
};

authRoute.post(a, register);
authRoute.post(b, login);
authRoute.delete(c, token, deleteAccount);
authRoute.get(d, getAccessToken);

export default authRoute;
