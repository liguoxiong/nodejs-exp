import bcrypt from "bcrypt";
import { check } from "express-validator";
import _ from "lodash";
import { UserModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";
import NewError from "../helpers/NewError";

const getCurrentUser = asyncCatchError(async (req, res) => {
  const user = await UserModel.findById(req.user._id).select("-password");
  res.status(200).json(succesResponseObj(user));
});

const getAllUser = asyncCatchError(async (req, res) => {
  const users = await UserModel.find({}).select("-password");
  res.status(200).json(succesResponseObj(users));
});

const userRegister = asyncCatchError(async (req, res, next) => {
  const { userName, password } = req.body;
  // ====== find an existing user ======//
  let user = await UserModel.findOne({ userName });
  if (user) {
    return next(new NewError("User already registered.", 400));
  }
  // ====== hash password ======//
  const passwordHash = await bcrypt.hash(password, 10);
  user = new UserModel({
    userName,
    password: passwordHash
  });
  await user.save();
  const token = await user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .status(201)
    .json({
      status: "success",
      message: "Register successfull"
    });
});

const userLogin = asyncCatchError(async (req, res, next) => {
  const { userName, password: passwordReq } = req.body;
  let user = await UserModel.findOne({ userName });
  if (!user) return next(new NewError("User not found!", 400));

  const isPasswordMatched = bcrypt.compareSync(passwordReq, user.password);
  if (!isPasswordMatched) return next(new NewError("Password not valid!", 400));

  const token = user.generateAuthToken();
  res
    .status(200)
    .header("x-auth-token", token)
    .json(succesResponseObj(_.omit(user._doc, "password")));
});

const updateProfile = asyncCatchError(async (req, res) => {
  const {
    phoneNumber,
    province,
    district,
    ward,
    add,
    email,
    fullName
  } = req.body;
  const profile = _.pickBy(
    {
      "profile.avatar": req.file ? req.file.filename : null,
      "profile.phoneNumber": phoneNumber,
      "profile.address.province": province,
      "profile.address.district": district,
      "profile.address.ward": ward,
      "profile.address.add": add,
      "profile.email": email,
      "profile.fullName": fullName
    },
    _.identity
  );
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $set: profile },
    { new: true }
  );
  res.status(200).json(succesResponseObj(_.omit(user._doc, "password")));;
});

const userLogout = (req, res) => {
  res
    .status(200)
    .header("x-auth-token", "")
    .json({
      status: "success",
      message: "Logout successful"
    });
};

const setRole = asyncCatchError(async (req, res, next) => {
  const { userId, role } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) return next(new NewError("User not found!", 400));

  user.role = role;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Update successfull"
  });
});

const changePassword = asyncCatchError(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.user._id);
  const isPasswordMatched = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordMatched) return next(new NewError("Password not valid!", 401));

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.password = passwordHash;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Update successfull"
  });
});

const validator = type => {
  switch (type) {
    case "register":
      return [
        check("userName").isLength({ min: 3, max: 50 }),
        check("password").isLength({ min: 3, max: 255 }),
        check(
          "passwordConfirmation",
          "passwordConfirmation field must have the same value as the password field"
        )
          .exists()
          .custom((value, { req }) => value === req.body.password)
      ];
    case "login":
      return [
        check("userName").isLength({ min: 3, max: 50 }),
        check("password").isLength({ min: 3, max: 255 })
      ];
    case "setRole":
      return [
        check("userId").exists(),
        check("role").isInt({ min: 0, max: 3 })
      ];
    case "changePassword":
      return [
        check("currentPassword").isLength({ min: 3, max: 255 }),
        check("newPassword").isLength({ min: 3, max: 255 }),
        check(
          "newPasswordConfirmation",
          "passwordConfirmation field must have the same value as the password field"
        )
          .exists()
          .custom((value, { req }) => value === req.body.newPassword)
      ];
    default:
      return [];
  }
};

export default {
  getCurrentUser,
  getAllUser,
  userRegister,
  userLogin,
  userLogout,
  updateProfile,
  setRole,
  changePassword,
  validator
};
