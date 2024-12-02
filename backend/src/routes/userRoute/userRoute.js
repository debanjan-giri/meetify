import { Router } from "express";
import { upateDetailsController } from "../../controllers/userController/userController";
 
const userRoute = Router();

userRoute.post("/user/update-details", upateDetailsController);
userRoute.get("/user/get-user-list");
userRoute.get("/user/mood-history");
 
// employee
userRoute.get("/user/employee-details/:userId");
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
