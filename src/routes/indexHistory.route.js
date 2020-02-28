import { Router } from "express";
import { auth, getResult } from "../middleware";
import { indexHistoryController } from "../controllers";
import { IndexHistoryModel } from "../models";

const router = Router();

router.post("/", auth, indexHistoryController.createIndexHistory);
router.get("/", auth, getResult(IndexHistoryModel), indexHistoryController.getAllIndexHistory);

export default router;
