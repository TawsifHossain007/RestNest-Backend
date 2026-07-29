import { Router } from "express";
import { landlordController } from "./landlord.controller";

const router = Router();

router.post("/properties", landlordController.createProperty)

export const landlordRouter = router;