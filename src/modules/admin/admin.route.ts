import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/category", auth(Role.ADMIN), adminController.createCategory)
router.get("/properties", auth(Role.ADMIN), adminController.getAllProperties)
router.get("/users", auth(Role.ADMIN), adminController.getAllUsers)
router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentalRequests)
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus)

export const adminRouter = router