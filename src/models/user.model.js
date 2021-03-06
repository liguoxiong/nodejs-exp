import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// simple schema
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255
    },
    // give different access rights if admin or not
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// custom method to generate authToken
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.SECRET_KEY
  ); // get the private key from the config file -> environment variable
  return token;
};

const User = mongoose.model("User", UserSchema);

export default User;
