import { IndexHistoryModel, ApartmentModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";

const createIndexHistory = asyncCatchError(async (req, res, next) => {
  const indexHistory = await IndexHistoryModel.create(req.body);
  if (req.body.typeIndex === 'CSD') {
    ApartmentModel.findByIdAndUpdate({_id: req.body.apartment}, {CSD: indexHistory._id})
  }
  if (req.body.typeIndex === 'CSN') {
    ApartmentModel.findByIdAndUpdate(req.body.apartment, {CSN: indexHistory._id})
  }
  res.status(201).json(succesResponseObj(indexHistory));
});

const getAllIndexHistory = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

export default { createIndexHistory, getAllIndexHistory };
