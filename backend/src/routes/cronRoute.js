import { Router } from "express";

const cronRoute = Router();
cronRoute.post("/cron/moodPoll/content"); // every day
cronRoute.post("/cron/qoute/content"); // every day


cronRoute.post("/cron/create-capsule"); // every day

// under development
//sunday monday and tuesday and  is for work
cronRoute.post("/cron/quiz/details"); // every wednesday
cronRoute.post("/cron/emotional-support/page"); // every thursday
cronRoute.post("/cron/praise/poll-open"); // every friday
cronRoute.post("/cron/match/details"); // every saturday

export default cronRoute;
