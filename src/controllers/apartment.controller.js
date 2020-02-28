import { ApartmentModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";

const createApartment = asyncCatchError(async (req, res, next) => {
  req.body.user = req.user._id;
  const apartment = await ApartmentModel.create(req.body);

  res.status(201).json(succesResponseObj(apartment));
});

const getAllApartment = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

export default { createApartment, getAllApartment };
