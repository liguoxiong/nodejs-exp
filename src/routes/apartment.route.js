import { Router } from "express";
import { auth, getResult, slugToObjectId } from "../middleware";
import { apartmentController } from "../controllers";
import { ApartmentModel, BlockModel } from "../models";

const router = Router();

router.post(
  "/create",
  auth,
  slugToObjectId(BlockModel, "block"),
  apartmentController.createApartment
);
router.get(
  "/",
  auth,
  slugToObjectId(BlockModel, "block"),
  getResult(ApartmentModel, ['CSD', 'CSN']),
  apartmentController.getAllApartment
);
router.post("/checkIn/:id", auth, apartmentController.checkIn);
router.get("/checkOut/:id", auth, apartmentController.checkOut);

export default router;
