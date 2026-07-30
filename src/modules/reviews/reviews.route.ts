import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./reviews.controller";

const router = Router();

router.post("/", auth(Role.TENANT), reviewController.postReviews)

export const reviewRouter = router;