import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.route";
import { landlordRouter } from "./modules/landllord/landlord.route";
import { adminRouter } from "./modules/admin/admin.route";
import { propertyRouter } from "./modules/properties/properties.route";
import { categoryRouter } from "./modules/categories/category.route";


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

app.use("/api/landlord", landlordRouter)
app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)
app.use("/api/properties", propertyRouter)
app.use("/api/categories", categoryRouter)
export default app;