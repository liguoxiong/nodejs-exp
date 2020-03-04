import mongoose from "mongoose";

const PaymentHistorySchema = new mongoose.Schema(
  {
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
    apartmentName: String,
    unitPrice: Number,
    CSD: {CSM: Number, CSC: Number},
    CSN: {CSM: Number, CSC: Number},
    nPerson: Number,
    pElectric: { price: Number, per: {type: String, enum: ["unit", "person"]}},
    pWater: { price: Number, per: {type: String, enum: ["unit", "person"]}},
    pTrash: { price: Number, per: {type: String, enum: ["unit", "person"]}},
    pInternet: { price: Number, per: {type: String, enum: ["unit", "person"]}},
    nBike: Number,
    pBike: Number,
    nAutoBike: Number,
    pAutoBike: Number,
    total: Number,
    status: Number,
    paymentAt: Date,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const PaymentHistory = mongoose.model("PaymentHistory", PaymentHistorySchema);

export default PaymentHistory;
