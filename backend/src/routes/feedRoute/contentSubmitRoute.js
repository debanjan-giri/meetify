import { Router } from "express";

const contentSubmitRoute = Router();
// "post", "status", "challenge"

contentSubmitRoute.post("/user/create-content/:contentType");
contentSubmitRoute.get("/user/get-content/:contentType");
contentSubmitRoute.delete("/user/delete-content/:contentType");

export default contentSubmitRoute;
