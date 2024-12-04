import { Router } from "express";
import {
  commentSubmitController,
  deleteCommentController,
  getCommentController,
  getContentByIdController,
  likeUnlikeCommentController,
  likeUnlikeSubmitController,
} from "../../controllers/commonController/commonController";

const commonRoute = Router();
// "post", "status", "challenge"
commonRoute.post("/user/like-unlike-submit", likeUnlikeSubmitController);
// content id , userId , content type , like type
commonRoute.post("/user/comment-submit", commentSubmitController);
commonRoute.post("/user/comment-like-unlike", likeUnlikeCommentController);
commonRoute.post("/user/content-detail-by-id", getContentByIdController);
commonRoute.post("/user/comment-delete", deleteCommentController);
commonRoute.post("/user/get-comment", getCommentController);

export default commonRoute;
