import { Router } from "express";

const pollQuoteRoute = Router();

pollQuoteRoute.post("/:userType/create-poll/:contentType");
pollQuoteRoute.delete("/:userType/delete-poll/:contentType");
pollQuoteRoute.get("/user/get-poll/:contentType");
pollQuoteRoute.post("/user/submit-poll/:contentType");

export default pollQuoteRoute;
