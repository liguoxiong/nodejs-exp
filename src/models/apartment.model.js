import mongoose from "mongoose";

const ApartmentSchema = new mongoose.Schema(
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
    price: Number,
    bonusInfo: [{ name: String, content: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Apartment = mongoose.model("Apartment", ApartmentSchema);

export default Apartment;
