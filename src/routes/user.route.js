import { Router } from "express";
import { auth, validate, imageUpload, isSuperAdmin } from "../middleware";
import { userController } from "../controllers";

const router = Router();

router.get("/current", auth, userController.getCurrentUser);

router.get("/", userController.getAllUser);

router.post(
  "/register",
  validate(userController.validator("register")),
  userController.userRegister
);

router.post(
  "/login",
  validate(userController.validator("login")),
  userController.userLogin
);

router.put(
  "/updateProfile",
  auth,
  imageUpload.uploadOneImage,
  imageUpload.resizeImage,
  userController.updateProfile
);

router.post(
  "/setRole",
  auth,
  isSuperAdmin,
  validate(userController.validator("setRole")),
  userController.setRole
);

router.post(
  "/changePassword",
  auth,
  validate(userController.validator("changePassword")),
  userController.changePassword
);

router.get("/logout", userController.userLogout);

export default router;
