import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";

const router = Router()

router.post("/create", auth(), paymentController.createCheckOutSession)
router.post("/confirm", paymentController.handleWebhook)

export const paymentRouter = router;