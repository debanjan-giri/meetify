import { Router } from "express";
import { accessTokenValidation as token } from "../../middleware/accessTokenValidation";
import {
  createPollController as createPoll,
  getMyPollsController as getMyPolls,
  deletePollByIdController as deletePollById,
  submitPollByIdController as submitPollById,
  systemGetOnePollController as systemGetOnePoll,
} from "../../controllers/pollQouteController";

const pollQuoteRoute = Router();

const { a, b, c, d, e, f } = {
  a: "/user/get-all-poll",
  b: "/user-created-poll",
  c: "/user/delete-poll",
  d: "/user/submit-poll",
  e: "/system/get-quote",
  f: "/system/get-one-mood-poll", // only one content type is 4
};

pollQuoteRoute.get(a, token, getMyPolls);
pollQuoteRoute.post(b, token, createPoll);
pollQuoteRoute.delete(c, token, deletePollById);
pollQuoteRoute.get(d, token, submitPollById);
pollQuoteRoute.post(f, token, systemGetOnePoll);

export default pollQuoteRoute;
