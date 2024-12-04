import { Router } from "express";

const matchMakingRoute = Router();

matchMakingRoute.get("/employee/match-making");
matchMakingRoute.post("/employee/match-status/:actionType/:contentType");

export default matchMakingRoute;
