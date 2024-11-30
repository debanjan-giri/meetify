import { Router } from "express";

const userAuthRoute = Router();

// all user
userAuthRoute.post("/user/register"); // register user
userAuthRoute.post("/user/login"); // login user
userAuthRoute.post("/user/delete-account"); // delete account
userAuthRoute.post("/user/refresh-token"); // token update
userAuthRoute.post("/user/update-profile"); // update profile details
userAuthRoute.get("/user/get-employee-list"); // get all employee list

// employee
userAuthRoute.post("/employee/send-connection"); // send employee connection
userAuthRoute.post("/employee/accept-connection"); // accept employee connection
userAuthRoute.post("/employee/remove-connection"); // remove employee connection

// admin
userAuthRoute.get("/admin/update-user-role"); // update user type

// admin or hr
userAuthRoute.get("/:userType/block-user"); // block user
userAuthRoute.get("/:userType/unblock-user"); // unblock user
userAuthRoute.get("/:userType/reported-list"); // get reported list

export default userAuthRoute;
