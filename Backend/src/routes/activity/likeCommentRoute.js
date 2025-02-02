import { Router } from "express";

const commonRoute = Router();

commonRoute.post("/user/like-unlike-submit");
commonRoute.post("/user/comment-submit");
commonRoute.post("/user/comment-like-unlike");
commonRoute.post("/user/content-detail-by-id");
commonRoute.post("/user/comment-delete");
commonRoute.post("/user/get-comment");

export default commonRoute;
