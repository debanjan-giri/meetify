import { Router } from "express";
import { registerController } from "../../controllers/userController/authController.js";

const authRoute = Router();

authRoute.post("/user/register", registerController);
authRoute.post("/user/login");
authRoute.delete("/user/delete-account");
authRoute.post("/user/refresh-token");

export default authRoute;
