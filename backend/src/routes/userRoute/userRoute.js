import { Router } from "express";
import { accessTokenValidation as token } from "../../middleware/accessTokenValidation.js";
import {
  upateDetailsController as upateDetails,
  getDetailsByIdController as getMyDetailsById,
  submitUnsubmitPhotoUrlController as submitUnsubmitPhotoUrl,
  getMyDetailsController as getMyDetails,
  getUserListController as getUserList,
  handleConnectionController as handleConnection,
  connectedRequestListController as connectedRequestList,
  submitUnsubmitReportController as submitUnsubmitReport,
} from "../../controllers/userController/userController.js";

const userRoute = Router();

// user
userRoute.post("/details-update", token, upateDetails);
userRoute.get("/get-details/:Id", token, getMyDetailsById);
userRoute.get("/submit-unsubmit-photoUrl", token, submitUnsubmitPhotoUrl);
userRoute.post("/get-my-details", token, getMyDetails);
userRoute.post("/user-list?cursor=abc123&limit=5", token, getUserList);
userRoute.post("/handle-connection", token, handleConnection);
userRoute.post("/connection-request-list", token, connectedRequestList);
userRoute.post("/sumbit-unsubmit-report", token, submitUnsubmitReport);
export default userRoute;
