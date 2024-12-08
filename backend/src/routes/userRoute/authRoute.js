import { Router } from "express";
import {
  deleteAccount,
  getAccessToken,
  login,
  register,
} from "../../controllers/userController/authController.js";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";

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
authRoute.delete(c, accessTokenValidation, deleteAccount);
authRoute.post(d, getAccessToken);

export default authRoute;
