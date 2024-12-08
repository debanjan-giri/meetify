import { Router } from "express";
import { accessTokenValidation } from "../../middleware/accessTokenValidation.js";
// import {
//   connectionList,
//   getMyDetails,
//   handleConnection,
//   removeConnection,
//   upateDetails,
// } from "../../controllers/userController/userController.js";

const userRoute = Router();

// user route
const { a, b, c, d, e, f, g } = {
  a: "/details-update", // personal details update
  b: "/get-details/:id", // get user details by id
  c: "/upload-profile-photo", // upload profile photo
  d: "/get-my-details", // get my details
  e: "/user-list?cursor=abc123&limit=5", // get all user list
  f: "/send-accept-connection", // send and accept connection
  g: "/remove-delete-connection", // remove and delete connection
  h: "/connection-request-list", // get connection list
};

// userRoute.post(a, accessTokenValidation, upateDetails);
// userRoute.get(b, accessTokenValidation);
// moderatorRoute.get(c, accessTokenValidation);
// userRoute.post(d, accessTokenValidation, getMyDetails);
// userRoute.post(e, accessTokenValidation);
// userRoute.post(f, accessTokenValidation, handleConnection);
// userRoute.post(g, accessTokenValidation, removeConnection);
// userRoute.post(h, accessTokenValidation, connectionList);

export default userRoute;
