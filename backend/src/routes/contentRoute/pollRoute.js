import { Router } from "express";
import { accessTokenValidation as token } from "../../middleware/accessTokenValidation";

import {
  createPollController as createPoll,
  getMyPollsController as getMyPolls,
  deletePollByIdController as deletePollById,
  submitPollByIdController as submitPollById,
  systemGetOnePollController as systemGetOnePoll,
} from "../../controllers/pollController";

const pollRoute = Router();
pollRoute.get("/poll/get-all-poll", token, getMyPolls);
pollRoute.post("/poll/create-poll", token, createPoll);
pollRoute.delete("/poll/delete-poll/:pollId", token, deletePollById);
pollRoute.get("/poll/submit-poll", token, submitPollById);


export default pollRoute;
