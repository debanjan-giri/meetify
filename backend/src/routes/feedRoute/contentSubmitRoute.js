import { Router } from "express";
import {
  createContentController,
  deleteMyContentController,
  getMyContentController,
} from "../../controllers/contentController/contentSubmitController";

const contentSubmitRoute = Router();
// "post", "status", "challenge"

contentSubmitRoute.post("/user/create-content", createContentController);
contentSubmitRoute.get("/user/my-all-content", getMyContentController);
contentSubmitRoute.delete("/user/delete-content", deleteMyContentController);
export default contentSubmitRoute;
