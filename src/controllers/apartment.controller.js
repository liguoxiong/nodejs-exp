import { ApartmentModel, BlockModel, IndexHistoryModel, PaymentHistoryModel } from '../models';
import { asyncCatchError, succesResponseObj } from '../helpers/utils';
import NewError from '../helpers/NewError';

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
  if (!apartment) return next(new NewError('apartment not found', 404));
  const { cusName, cusAddress, nPerson, nBike, nAutoBike } = req.body;
  apartment = await ApartmentModel.findByIdAndUpdate(
    req.params.id,
    {
      status: 1,
      cusName,
      cusAddress,
      nPerson,
      nBike,
      nAutoBike,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json(succesResponseObj(apartment));
});

const checkOut = asyncCatchError(async (req, res, next) => {
  let apartment = await ApartmentModel.findById(req.params.id);
  if (!apartment) return next(new NewError('apartment not found', 404));
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
      runValidators: true,
    },
  );
  res.status(200).json(succesResponseObj(apartment));
});

const createBill = asyncCatchError(async (req, res, next) => {
  if (req.params.id) {
    const apartment = await ApartmentModel.findById(req.params.id);
    if (!apartment) return next(NewError('apartment not found', 404));
    const eIndexHistory = await IndexHistoryModel.find({
      apartment: req.params.id,
      typeIndex: 'CSD',
    })
      .sort({ createdAt: -1 })
      .limit(2);
    const wIndexHistory = await IndexHistoryModel.find({
      apartment: req.params.id,
      typeIndex: 'CSN',
    })
      .sort({ createdAt: -1 })
      .limit(2);
    const block = await BlockModel.findById(apartment.block);
    const request = {
      apartment: apartment._id,
      unitPrice: apartment.price,
      CSD: { CSM: eIndexHistory[0].index || 0, CSC: eIndexHistory[1].index || 0 },
      CSN: { CSM: wIndexHistory[0].index || 0, CSC: wIndexHistory[1].index || 0 },
      nPerson: apartment.nPerson,
      pElectric: block.pElectric,
      pWater: block.pWater,
      pTrash: block.pTrash,
      pInternet: block.pInternet,
      nBike: apartment.nBike,
      pBike: block.pBike,
      nAutoBike: apartment.nAutoBike,
      pAutoBike: block.pAutoBike,
    };
    const totalE =
      block.pElectric.per === 'unit'
        ? block.pElectric.price * (request.CSD.CSM - request.CSD.CSC)
        : block.pElectric.price * request.nPerson;
    const totalW =
      block.pWater.per === 'unit'
        ? block.pWater.price * (request.CSN.CSM - request.CSN.CSC)
        : block.pWater.price * request.nPerson;
    const totalBike = request.nBike * request.pBike;
    const totalAutoBike = request.nAutoBike * request.pAutoBike;
    const totalTrash =
      block.pTrash.per === 'unit' ? block.pTrash.price : block.pTrash * request.nPerson;
    const totalI =
      block.pInternet.per === 'unit'
        ? block.pInternet.price
        : block.pInternet.price * request.nPerson;
    request.total =
      apartment.price + totalE + totalW + totalBike + totalAutoBike + totalTrash + totalI;
    const paymentHistory = await PaymentHistoryModel.create(request);
    return res.status(201).json(succesResponseObj(paymentHistory));
  }
});

export default { createApartment, getAllApartment, checkIn, checkOut, createBill };
