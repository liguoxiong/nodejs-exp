import { Router } from "express";
import { auth, getResult, slugToObjectId } from "../middleware";
import { blockController } from "../controllers";
import { BlockModel, PaymentHistoryModel } from "../models";

const router = Router();

router.post("/create", auth, blockController.createBlock);
router.get("/", auth, getResult(BlockModel), blockController.getAllBlock);
router.get("/:slug", auth, blockController.getBlock);
router.put("/:slug", auth, blockController.updateBlock);
router.get("/paymentHistory", auth, slugToObjectId(BlockModel, "block"), getResult(PaymentHistoryModel), blockController.getAllPaymentHistory)
export default router;
