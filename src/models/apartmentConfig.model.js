import mongoose from "mongoose";

const ApartmentConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"]
  },
  ePrice: String,
  wPrice: String,
  iPrice: String,
  trashPrice: String
});

const ApartmentConfig = mongoose.model(
  "ApartmentConfig",
  ApartmentConfigSchema
);

export default ApartmentConfig;
