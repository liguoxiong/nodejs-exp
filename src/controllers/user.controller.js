import bcrypt from "bcrypt";
import { check } from "express-validator";
import _ from "lodash";
import { UserModel } from "../models";

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-password");
    res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const userRegister = async (req, res) => {
  const { userName, password } = req.body;
  try {
    // ====== find an existing user ======//
    let user = await UserModel.findOne({ userName });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered."
      });
    }
    // ====== hash password ======//
    const passwordHash = await bcrypt.hash(password, 10);
    user = new UserModel({
      userName,
      password: passwordHash
    });
    await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .status(201)
      .json({
        success: true,
        message: "Register successfull",
        token
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { userName, password: passwordReq } = req.body;
    let user = await UserModel.findOne({ userName });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    const isPasswordMatched = bcrypt.compareSync(passwordReq, user.password);
    if (!isPasswordMatched)
      return res.status(401).json({
        success: false,
        message: "Password not valid!"
      });
    const token = user.generateAuthToken();
    res
      .status(200)
      .header("x-auth-token", token)
      .json({
        success: true,
        user: _.omit(user._doc, "password"),
        token
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const updateProfile = async (req, res) => {
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
  res.json({ success: true, user: _.omit(user._doc, "password") });
};

const userLogout = (req, res) => {
  res
    .status(200)
    .header("x-auth-token", "")
    .json({
      success: true,
      message: "Logout successful"
    });
};

const setRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }
    user.role = role;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Update successfull"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user._id);
    const isPasswordMatched = bcrypt.compareSync(
      currentPassword,
      user.password
    );
    if (!isPasswordMatched)
      return res.status(401).json({
        success: false,
        message: "Password not valid!"
      });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Update successfull"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

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
