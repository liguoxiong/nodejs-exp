import mongoose from "mongoose";
import v from "voca";
import { genUniqueCode } from "../helpers/utils";

const ApartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"]
    },
    slug: {
      type: String,
      unique: true
    },
    description: String,
    images: [{ name: String, uri: String }],
    thumb: String,
    price: Number,
    cusName: String,
    cusAddress: String,
    nPerson: Number,
    nBike: Number,
    nAutoBike: Number,
    status: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    block: { type: mongoose.Schema.Types.ObjectId, ref: "Block" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

ApartmentSchema.pre("save", function(next) {
  this.slug = `${v.slugify(this.name)}-${genUniqueCode()}`;
  next();
});
const Apartment = mongoose.model("Apartment", ApartmentSchema);

export default Apartment;
