import { ApartmentModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";
import NewError from "../helpers/NewError";

const createApartment = asyncCatchError(async (req, res, next) => {
  req.body.user = req.user._id;
  const apartment = await ApartmentModel.create(req.body);

  res.status(201).json(succesResponseObj(apartment));
});

const getAllApartment = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

const checkIn = asyncCatchError(async (req, res, next) => {
  let apartment = await ApartmentModel.findById(req.params.id);
  if (!apartment) return next(new NewError("apartment not found", 404));
  const { cusName, cusAddress, nPerson, nBike, nAutoBike } = req.body;
  apartment = await ApartmentModel.findByIdAndUpdate(
    req.params.id,
    {
      status: 1,
      cusName,
      cusAddress,
      nPerson,
      nBike,
      nAutoBike
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json(succesResponseObj(apartment));
});

const checkOut = asyncCatchError(async (req, res, next) => {
  let apartment = await ApartmentModel.findById(req.params.id);
  if (!apartment) return next(new NewError("apartment not found", 404));
  apartment = await ApartmentModel.findByIdAndUpdate(
    req.params.id,
    {
      status: 0,
      cusName: '',
      cusAddress: '',
      nPerson: 0,
      nBike: 0,
      nAutoBike: 0,
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json(succesResponseObj(apartment));
});

export default { createApartment, getAllApartment, checkIn, checkOut };
