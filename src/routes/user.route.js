import { Router } from "express";
import { auth } from "../middleware";
import { userController } from "../controllers";

const router = Router();

router.get("/current", auth, userController.getCurrentUser);

router.get("/", auth, userController.getAllUser);

router.post(
  "/register",
  userController.userRegister
);

router.post(
  "/login",
  userController.userLogin
);

router.post(
  "/changePassword",
  auth,
  userController.changePassword
);

router.get("/logout", userController.userLogout);

export default router;
