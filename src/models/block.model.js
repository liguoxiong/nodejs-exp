import mongoose from "mongoose";
import v from "voca";
import { geocoder } from "../helpers/utils";

const BlockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [250, "Name can not be more than 250 characters"]
    },
    slug: String,
    description: String,
    images: [{ name: String, uri: String }],
    thumb: String,
    bonusInfo: [{ name: String, content: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    config: { type: mongoose.Schema.Types.ObjectId, ref: "ApartmentConfig" },
    address: {
      type: String,
      required: [true, "Please add an address"]
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

BlockSchema.pre("save", function(next) {
  this.slug = v.slugify(this.name);
  next();
});

BlockSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

const Block = mongoose.model("Block", BlockSchema);

export default Block;
