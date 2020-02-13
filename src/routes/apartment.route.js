import { Router } from "express";
import { auth } from "../middleware";
import { apartmentController } from "../controllers";

const router = Router();

// ===== APARTMENT =====//
router.post("/create", auth, apartmentController.createApartment);

export default router;
