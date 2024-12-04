import { Router } from "express";
import {
  connectionListController,
  getEmployeeDetailsController,
  getUserDetailsController,
  handleConnectionController,
  removeConnectionController,
  suffledUserListController,
  upateDetailsController,
} from "../../controllers/userController/userController.js";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";

const userRoute = Router();

// update my details
userRoute.post(
  "/user/update-my-details",
  accessTokenValidation,
  upateDetailsController
);

// get my details
userRoute.get(
  "/get-my-details",
  accessTokenValidation,
  getUserDetailsController
);

// suffled friend list
userRoute.get(
  "/get-suffled-user-list",
  accessTokenValidation,
  suffledUserListController
);

// employee details by id
userRoute.post(
  "/get-employee-details",
  accessTokenValidation,
  getEmployeeDetailsController
);

// request and accept employee
userRoute.post(
  "/send-accept-employee",
  accessTokenValidation,
  handleConnectionController
);

// clear request and unfriend employee
userRoute.post(
  "/remove-unfd-employee",
  accessTokenValidation,
  removeConnectionController
);

// request and connection list
userRoute.get(
  "/user/connection-list/:type",
  accessTokenValidation,
  connectionListController
);
export default userRoute;
