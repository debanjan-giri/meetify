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
// admin
moderatorRoute.post("/update-user-role", token, updateUserRole);
moderatorRoute.post("/block-unblock-user", token, blockUnblockUser);
moderatorRoute.get("/reported-list?page=1&limit=5", token, reportedContent);
moderatorRoute.post("/content-removed", token, contentRemoved);
moderatorRoute.post("/undo-reported-content", token, undoReportedContent);
moderatorRoute.post("/sumbit-unsubmit-report", token, submitUnsubmitReport);

export default moderatorRoute;
