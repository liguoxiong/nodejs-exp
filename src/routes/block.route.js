import { Router } from "express";
import { auth, getResult } from "../middleware";
import { blockController } from "../controllers";
import { BlockModel } from "../models";

const router = Router();

// ===== BLOCK =====//
router.post("/create", auth, blockController.createBlock);
router.get("/", auth, getResult(BlockModel), blockController.getAllBlock);

export default router;
