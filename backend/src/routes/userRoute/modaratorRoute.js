import { Router } from "express";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";
import {
  blockUnblockUserController,
  contentRemovingController,
  getReportedContentController,
  getTotalUserController,
  submitReportedController,
  updateUserRoleController,
} from "../../controllers/userController/modaratorController.js";

const modaratorRoute = Router();

// admin
modaratorRoute.get(
  "/admin/update-user-role",
  accessTokenValidation,
  updateUserRoleController
);
modaratorRoute.post(
  "/admin/block-unblock-user",
  accessTokenValidation,
  blockUnblockUserController
);
modaratorRoute.post(
  "/user/mark-report-content",
  accessTokenValidation,
  submitReportedController
);
modaratorRoute.get(
  "/admin/get-reported-content",
  accessTokenValidation,
  getReportedContentController
);
modaratorRoute.post(
  "/admin/content-removed",
  accessTokenValidation,
  contentRemovingController
);

modaratorRoute.get(
  "/admin/get-all-type-user",
  accessTokenValidation,
  getTotalUserController
);

modaratorRoute.delete("/admin/delete-hashtag");

export default modaratorRoute;
