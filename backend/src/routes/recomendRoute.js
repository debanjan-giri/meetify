import { Router } from "express";

const recomendRoute = Router();

recomendRoute.get("/recomend/content"); //suffle
recomendRoute.get("/recomend/user-list"); //suffle

export default recomendRoute;
