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
} from "../../controllers/userController/userController.js";

const userRoute = Router();

// user route
const { a, b, c, d, e, f, h } = {
  a: "/details-update", // personal details update
  b: "/get-details/:Id", // get user details by id
  c: "/submit-unsubmit-photoUrl", // upload profile photo
  d: "/get-my-details", // get my details
  e: "/user-list?cursor=abc123&limit=5", // get all user list
  f: "/handle-connection", // send and accept remove delete connection
  h: "/connection-request-list", // get connection list
};

userRoute.post(a, token, upateDetails);
userRoute.get(b, token, getMyDetailsById);
moderatorRoute.get(c, token, submitUnsubmitPhotoUrl);
userRoute.post(d, token, getMyDetails);
userRoute.post(e, token, getUserList);
userRoute.post(f, token, handleConnection);
userRoute.post(h, token, connectedRequestList);

export default userRoute;
