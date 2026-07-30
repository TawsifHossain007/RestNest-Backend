import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/properties", auth(Role.LANDLORD), landlordController.createProperty)
router.put("/properties/:id", auth(Role.LANDLORD), landlordController.updateProperty)
router.delete("/properties/:id", auth(Role.LANDLORD), landlordController.deletePropertyFromDB)
router.get("/requests", auth(Role.LANDLORD), landlordController.getMyPropertyReq)
router.patch("/requests/:id", auth(Role.LANDLORD), landlordController.updateRentalReq)


export const landlordRouter = router;