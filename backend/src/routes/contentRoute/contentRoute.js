import { Router } from "express";

import { accessTokenValidation as token } from "../../middleware/accessTokenValidation.js";

import { createContentController as createContent } from "../../controllers/contentController/contentController.js";

const contentRoute = Router();
// "post", "status", "challenge" , hashtag

contentRoute.post("/content/create", token, createContent);
contentRoute.get("/content/public-content", token, getAllContent);
contentRoute.post("/content/friends-content", token, getAllContent); // id
contentRoute.delete("/content/delete/:contentId", token, deleteContent);
contentRoute.get("/content/detail/:contentId", token, getDetailsById);
export default contentRoute;
