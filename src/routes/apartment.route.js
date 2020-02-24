import { Router } from "express";
import { auth, getResult } from "../middleware";
import { apartmentController } from "../controllers";
import { ApartmentModel } from "../models";

const router = Router();

// ===== APARTMENT =====//
router.post("/create", auth, apartmentController.createApartment);
router.get("/", auth, getResult(ApartmentModel), apartmentController.getAllApartment);

export default router;
