import { Router } from "express";
import { auth, getResult } from "../middleware";
import { memberController } from "../controllers";
import { MemberModel } from "../models";

const router = Router();

router.post("/", auth, memberController.createMember);
router.get("/", auth, getResult(MemberModel), memberController.getAllMember);

export default router;
