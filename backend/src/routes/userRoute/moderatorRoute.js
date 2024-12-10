import { Router } from "express";
import { accessTokenValidation as token } from "../../middleware/accessTokenValidation.js";
import {
  getReportedContentController as reportedContent,
  blockUnblockUserController as blockUnblockUser,
  updateUserRoleController as updateUserRole,
  contentRemovedController as contentRemoved,
  undoReportedContentController as undoReportedContent,
  submitReportController as submitUnsubmitReport,
} from "../../controllers/userController/moderatorController.js";

const moderatorRoute = Router();

// moderator route
const { a, b, c, d, e } = {
  a: "/update-user-role", // admin can update user role by id
  b: "/block-unblock-user", // admin or hr can block/unblock user by id
  c: "/reported-content-list?page=1&limit=5", // admin or hr get all reported content
  d: "/content-removed", // admin or hr can remove content
  e: "/undo-reported-content", // admin or hr can undo reported content by id
  f: "/sumbit-unsubmit-report", // user can submit/unsubmit report by id
};

// admin
moderatorRoute.post(a, token, updateUserRole);
moderatorRoute.post(b, token, blockUnblockUser);
moderatorRoute.get(c, token, reportedContent);
moderatorRoute.post(d, token, contentRemoved);
moderatorRoute.post(e, token, undoReportedContent);
moderatorRoute.post(f, token, submitUnsubmitReport);

export default moderatorRoute;
