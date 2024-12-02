import { Router } from "express";

const questionRoute = Router();
questionRoute.get("/user/read-questions");
questionRoute.post("/user/crate-question");
questionRoute.delete("/user/delete-question");
questionRoute.post("/user/update-question");

export default questionRoute;
