import { Router } from "express";

const commonRoute = Router();
// "post", "status", "challenge"
commonRoute.post("/user/like-unlike-submit"); 
// content id , userId , content type , like type
commonRoute.post("/user/comment-submit");
commonRoute.post("/user/comment-delete");
commonRoute.post("/user/content-detail-by-id");

export default commonRoute;
