import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/connetDB.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import { okResponse } from "./utils/reqResFunction.js";
import authRoute from "./routes/user/authRoute.js";

// express app
const app = express(); // main express app
const envFile = `.env.${process.env.NODE_ENV || "dev"}`; // select env file
dotenv.config({ path: envFile }); //  loading  env variables
connectDB(); // connect to db

// middleware
app.use(helmet()); // enable http security this
app.use(cors()); // enable cors origin
app.use(cookieParser()); // access cookies in  browser
app.use(express.json()); // parse request body as  json format

// prefix routes
app.use("/auth", authRoute);

// global error  handler
app.use(errorHandler);

// not found route
app.use("*", (req, res) => {
  return okResponse({
    response: res,
    message: "Route not found",
  });
});

// port
const PORT = process.env.PORT || 5555;

// server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} environment
on port ${PORT}`
  );
});
