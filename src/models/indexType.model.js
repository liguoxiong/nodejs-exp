import mongoose from "mongoose";

const IndexTypeSchema = new mongoose.Schema(
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

const IndexType = mongoose.model("IndexType", IndexTypeSchema);

export default IndexType;
