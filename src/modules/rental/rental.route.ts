import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.TENANT), rentalController.createRentalReq)
router.get("/", auth(Role.TENANT), rentalController.getMyRentalRequest)
router.get("/:id", auth(Role.TENANT), rentalController.getMyRentalRequestById)

export const rentalRouter = router;