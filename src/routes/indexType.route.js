import { Router } from "express";
import { auth, getResult } from "../middleware";
import { indexTypeController } from "../controllers";
import { IndexTypeModel } from "../models";

const router = Router();

router.post("/", auth, indexTypeController.createIndexType);
router.get(
  "/",
  auth,
  getResult(IndexTypeModel),
  indexTypeController.getAllIndexType
);

export default router;
