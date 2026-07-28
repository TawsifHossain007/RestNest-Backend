import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import cookieParser from "cookie-parser";

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

export default app;