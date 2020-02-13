import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    slug: String,
    address: {
      addressFormated: String,
      province: String,
      district: String,
      ward: String,
      street: String,
      number: String,
      location: {
        lat: Number,
        lng: Number
      }
    },
    description: String,
    images: [{ name: String, uri: String }],
    thumb: String,
    bonusInfo: [{ name: String, content: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Block = mongoose.model("Block", BlockSchema);

export default Block;
