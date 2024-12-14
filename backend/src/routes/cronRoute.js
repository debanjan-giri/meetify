import { Router } from "express";

const cronRoute = Router();
cronRoute.post("/cron/moodPoll/content"); // every day
cronRoute.post("/cron/qoute/content"); // every day

// under development
// monday and tuesday is for work
cronRoute.post("/cron/emotional-support/page"); // every wednesday
cronRoute.post("/cron/time-capsule/open"); // every thursday
cronRoute.post("/cron/praise/poll-open"); // every friday
cronRoute.post("/cron/match/details"); // every saturday
cronRoute.post("/cron/quiz/details"); // every sunday

export default cronRoute;
