import { Router } from "express";
import { auth, getResult } from "../middleware";
import { blockController } from "../controllers";
import { BlockModel } from "../models";

const router = Router();

router.post("/create", auth, blockController.createBlock);
router.get("/", auth, getResult(BlockModel), blockController.getAllBlock);
router.get("/:slug", auth, blockController.getBlock);
router.put("/:slug", auth, blockController.updateBlock);

export default router;
