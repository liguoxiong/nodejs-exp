import { Router } from "express";
import apartmentRoute from "./apartment.route";
import blockRoute from "./block.route";
import userRoute from "./user.route";

const router = Router();

router.use("/apartments", apartmentRoute);
router.use("/blocks", blockRoute);
router.use("/user", userRoute);

export default router;
