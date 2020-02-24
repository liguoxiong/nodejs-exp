import { ApartmentModel, BlockModel } from "../models";
import NewError from "../helpers/NewError";
import { asyncCatchError } from "../helpers/utils";

const createApartment = asyncCatchError(async (req, res) => {
  req.body.user = req.user._id;
  const block = await BlockModel.findOne({slug: req.body.block})
  if (!block) {
    return new NewError("Block not exist", 400);
  }
  req.body.block = block._id
  const apartment = await ApartmentModel.create(req.body);

  res.status(201).json({
    status: "success",
    data: apartment
  });
});

const getAllApartment = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

export default { createApartment, getAllApartment };
