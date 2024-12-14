import { Router } from "express";

import { accessTokenValidation as token } from "../../middleware/accessTokenValidation.js";
import {
  createContentController as createContent,
  getContentDetailsByIdController as getDetailsById,
  deleteContentByIdController as deleteContent,
  getAllContentController as getAllContent,
} from "../../controllers/contentController.js";

const contentRoute = Router();
// "post", "status", "challenge" , hashtag

const {} = {
  a: "/user/create-content", // diff content type
  b: "/user/my-all-content", //  cursor pagination
  c: "/user/delete-content", // delete by id
  d: "/user/content-detail-by-id", // get content by id
};

contentRoute.post(a, token, createContent);
contentRoute.get(b, token, getAllContent);
contentRoute.delete(c, token, deleteContent);
contentRoute.get(d, token, getDetailsById);
export default contentRoute;
