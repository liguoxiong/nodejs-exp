import { Router } from "express";
import { auth } from "../middleware";
import { blockController } from "../controllers";

const router = Router();

// ===== BLOCK =====//
router.post("/create", auth, blockController.createBlock);
router.get("/", auth, blockController.getAllBlock);

export default router;
