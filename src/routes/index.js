import { Router } from "express";
import apartmentRoute from "./apartment.route";
import userRoute from "./user.route";

const router = Router();

router.use("/apartment", apartmentRoute);
router.use("/user", userRoute);

export default router;
