import { Router } from "express";

const statusRoute = Router();

statusRoute.get("/:userType/create-status"); // create status
statusRoute.get("/user/get-all-status"); // get status
statusRoute.get("/delete-status"); // delete status

export default statusRoute;