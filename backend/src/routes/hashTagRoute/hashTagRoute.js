import { Router } from "express";

const hashTagRoute = Router();

hashTagRoute.post("/user/create-hashtag");
hashTagRoute.delete("/user/delete-hashtag");
hashTagRoute.post("/user/get-all-hashtag");
hashTagRoute.post("/user/update-hashtag/:hashTagId");

// post
hashTagRoute.get("/user/create-hashtag-posts");
hashTagRoute.get("/user/get-hashtag-posts");
hashTagRoute.get("/user/get-hashtag-posts-details/:hashTagId");
hashTagRoute.post("/user/hashtag-post-like/:hashTagPostId");
hashTagRoute.post("/user/hashtag-post-comment/:hashTagPostId");
hashTagRoute.post("/user/hashtag-post-comment-like/:hashTagPostId");

export default hashTagRoute;
 