import mongoose from "mongoose";

const IndexHistorySchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    date: Date,
    typeIndex: String,
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const IndexHistory = mongoose.model("IndexHistory", IndexHistorySchema);

export default IndexHistory;
