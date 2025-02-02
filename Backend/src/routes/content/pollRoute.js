import { Router } from "express";


const pollRoute = Router();
pollRoute.get("/poll/get-all-poll", token);
pollRoute.post("/poll/create-poll", token);
pollRoute.delete("/poll/delete-poll/:pollId", token);
pollRoute.get("/poll/submit-poll", token);


export default pollRoute;
