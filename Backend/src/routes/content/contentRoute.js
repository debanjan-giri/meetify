import { Router } from "express";


const contentRoute = Router();
contentRoute.post("/content/create", token);
contentRoute.get("/content/public-content", token);
contentRoute.post("/content/friends-content", token); // id
contentRoute.delete("/content/delete/:contentId", token);
contentRoute.get("/content/detail/:contentId", token);
export default contentRoute;
