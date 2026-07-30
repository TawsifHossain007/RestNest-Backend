import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";

const router = Router()

router.post("/create", auth(), paymentController.createCheckOutSession)

export const paymentRouter = router;