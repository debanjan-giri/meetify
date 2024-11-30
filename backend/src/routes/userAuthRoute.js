import { Router } from "express";
import {
  loginController,
  refreshTokenController,
  registerController,
} from "../controllers/authController.js";

const userAuthRoute = Router();
userAuthRoute.post("/register", registerController);
userAuthRoute.post("/login", loginController);
userAuthRoute.post("/refresh-token", refreshTokenController);

export default userAuthRoute;
