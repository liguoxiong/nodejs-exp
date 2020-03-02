import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      unique: true
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Member = mongoose.model("Member", MemberSchema);

export default Member;