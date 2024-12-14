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

contentRoute.post("/content/create", token, createContent);
contentRoute.get("/content/my-all", token, getAllContent);
contentRoute.delete("/content/delete/:contentId", token, deleteContent);
contentRoute.get("/content/detail/:contentId", token, getDetailsById);
export default contentRoute;
