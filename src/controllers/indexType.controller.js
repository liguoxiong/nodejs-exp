import { IndexTypeModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";

const createIndexType = asyncCatchError(async (req, res, next) => {
  const indexType = await IndexTypeModel.create(req.body);

  res.status(201).json(succesResponseObj(indexType));
});

const getAllIndexType = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

export default { createIndexType, getAllIndexType };
