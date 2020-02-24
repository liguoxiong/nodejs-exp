import { Router } from "express";
import { auth, getResult, slugToObjectId } from "../middleware";
import { apartmentController } from "../controllers";
import { ApartmentModel, BlockModel } from "../models";

const router = Router();

// ===== APARTMENT =====//
router.post("/create", auth, apartmentController.createApartment);
router.get("/", auth, slugToObjectId(BlockModel, 'stock'), getResult(ApartmentModel), apartmentController.getAllApartment);

export default router;
