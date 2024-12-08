import { Router } from "express";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";
import {
  blockUnblockUser,
  contentRemoved,
  reportedContent,
  updateUserRole,
} from "../../controllers/userController/modaratorController.js";

const modaratorRoute = Router();

// modarator route
const { a, b, c, d, e } = {
  a: "/update-user-role", // admin can update user role
  b: "/block-unblock-user", // admin or hr can block/unblock user
  c: "/reported-content", // admin or hr get all reported content
  d: "/content-removed", // admin or hr can remove content
  e: "/delete-hashtag", // admin or hr can delete hashtag
};

// admin
modaratorRoute.get(a, accessTokenValidation, updateUserRole);
modaratorRoute.post(b, accessTokenValidation, blockUnblockUser);
modaratorRoute.get(c, accessTokenValidation, reportedContent);
modaratorRoute.post(d, accessTokenValidation, contentRemoved);
modaratorRoute.delete(e, accessTokenValidation);

export default modaratorRoute;
