import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/category", auth(Role.ADMIN), adminController.createCategory)

export const adminRouter = router