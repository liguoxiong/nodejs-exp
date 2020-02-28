import { IndexHistoryModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";

const createIndexHistory = asyncCatchError(async (req, res, next) => {
  const indexHistory = await IndexHistoryModel.create(req.body);

  res.status(201).json(succesResponseObj(indexHistory));
});

const getAllIndexHistory = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

export default { createIndexHistory, getAllIndexHistory };
