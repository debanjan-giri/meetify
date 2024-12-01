import { Router } from "express";

const userAuthRoute = Router();

// all user
userAuthRoute.post("/user/register");
userAuthRoute.post("/user/login");
userAuthRoute.delete("/user/delete-account");
userAuthRoute.post("/user/refresh-token");
userAuthRoute.post("/user/update-profile");
userAuthRoute.get("/user/get-employee-list");
userAuthRoute.get("/user/mood-history");

// employee
userAuthRoute.get("/user/employee-details/:userId");
userAuthRoute.post("/employee/send-connection");
userAuthRoute.post("/employee/accept-connection");
userAuthRoute.post("/employee/remove-connection");
userAuthRoute.post("/employee/connection-list");
userAuthRoute.post("/employee/connection-request-list");

// admin
userAuthRoute.get("/:userType/update-user-role");
userAuthRoute.post("/:userType/block-user");
userAuthRoute.post("/:userType/unblock-user");
userAuthRoute.post("/:userType/reported/:contentId");
userAuthRoute.get("/:userType/get-reported-content");
userAuthRoute.post("/:userType/content-removed");

export default userAuthRoute;
