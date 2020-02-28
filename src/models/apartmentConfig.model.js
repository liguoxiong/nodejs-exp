import mongoose from "mongoose";

const ApartmentConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"]
  },
  price: Number,
  typeOfMember: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  block: { type: mongoose.Schema.Types.ObjectId, ref: "Block" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},
{ timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ApartmentConfig = mongoose.model(
  "ApartmentConfig",
  ApartmentConfigSchema
);

export default ApartmentConfig;
