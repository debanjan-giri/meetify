import { Router } from "express";

const likeCommentRoute = Router();
// "post", "status", "challenge"
likeCommentRoute.post("/user/like/:contentType/:contentId");
likeCommentRoute.post("/user/comment/:contentType/:contentId?");
