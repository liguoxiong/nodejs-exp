import { BlockModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";

const createBlock = asyncCatchError(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user._id;
  const block = await BlockModel.create(req.body);

  res.status(201).json(succesResponseObj(block));
});

const getAllBlock = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

export default { createBlock, getAllBlock };
