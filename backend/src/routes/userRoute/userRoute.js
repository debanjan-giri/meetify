import { Router } from "express";

const userRoute = Router();

userRoute.post("/user/update-profile");
userRoute.get("/user/get-employee-list");
userRoute.get("/user/mood-history");

// employee
userRoute.get("/user/employee-details/:userId");
userRoute.post("/employee/send-connection");
userRoute.post("/employee/accept-connection");
userRoute.post("/employee/remove-connection");
userRoute.post("/employee/connection-list");
userRoute.post("/employee/connection-request-list");

// admin
userRoute.get("/:userType/update-user-role");
userRoute.post("/:userType/block-user");
userRoute.post("/:userType/unblock-user");
userRoute.post("/:userType/reported/:contentId");
userRoute.get("/:userType/get-reported-content");
userRoute.post("/:userType/content-removed");

export default userRoute;
