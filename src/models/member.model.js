import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      unique: true
    },
    block: { type: mongoose.Schema.Types.ObjectId, ref: "Block" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Member = mongoose.model("Member", MemberSchema);

export default Member;
