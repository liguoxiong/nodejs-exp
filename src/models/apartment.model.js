import mongoose from "mongoose";

const ApartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    slug: String,
    description: String,
    images: [{ name: String, uri: String }],
    thumb: String,
    price: Number,
    electricIndex: String,
    waterIndex: String,
    status: Number,
    bonusInfo: [{ name: String, content: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Apartment = mongoose.model("Apartment", ApartmentSchema);

export default Apartment;
