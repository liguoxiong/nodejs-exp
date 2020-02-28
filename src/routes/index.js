import { Router } from "express";
import apartmentRoute from "./apartment.route";
import blockRoute from "./block.route";
import userRoute from "./user.route";
import memberRoute from "./member.route";
import indexHistoryRoute from "./indexHistory.route";

const router = Router();

router.use("/apartments", apartmentRoute);
router.use("/user", userRoute);
router.use("/blocks", blockRoute);
router.use("/memebers", memberRoute);
router.use("/indexHistory", indexHistoryRoute);

export default router;
