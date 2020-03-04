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
  const { cusName, cusAddress, nPerson, nBike, nAutoBike, startDate } = req.body;
  apartment = await ApartmentModel.findByIdAndUpdate(
    req.params.id,
    {
      status: 1,
      cusName,
      cusAddress,
      nPerson,
      nBike,
      nAutoBike,
      startDate,
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
  const calTotalPay = (apartmentPay) => {
    const totalE =
      apartmentPay.pElectric.per === 'unit'
        ? apartmentPay.pElectric.price * (apartmentPay.CSD.CSM - apartmentPay.CSD.CSC)
        : apartmentPay.pElectric.price * apartmentPay.nPerson;
    const totalW =
      apartmentPay.pWater.per === 'unit'
        ? apartmentPay.pWater.price * (apartmentPay.CSN.CSM - apartmentPay.CSN.CSC)
        : apartmentPay.pWater.price * apartmentPay.nPerson;
    const totalBike = apartmentPay.nBike * apartmentPay.pBike;
    const totalAutoBike = apartmentPay.nAutoBike * apartmentPay.pAutoBike;
    const totalTrash =
      apartmentPay.pTrash.per === 'unit' ? apartmentPay.pTrash.price : apartmentPay.pTrash * apartmentPay.nPerson;
    const totalI =
      apartmentPay.pInternet.per === 'unit'
        ? apartmentPay.pInternet.price
        : apartmentPay.pInternet.price * apartmentPay.nPerson;
    const total =
    apartmentPay.price + totalE + totalW + totalBike + totalAutoBike + totalTrash + totalI;
    return { ...apartmentPay, total}
  }
  if (req.query.apartment) {
    const apartment = await ApartmentModel.findById(req.params.id);
    if (!apartment) return next(NewError('apartment not found', 404));
    const eIndexHistory = await IndexHistoryModel.find({
      apartment: req.query.apartment,
      typeIndex: 'CSD',
    })
      .sort({ createdAt: -1 })
      .limit(2);
    const wIndexHistory = await IndexHistoryModel.find({
      apartment: req.query.apartment,
      typeIndex: 'CSN',
    })
      .sort({ createdAt: -1 })
      .limit(2);
    const block = await BlockModel.findById(apartment.block);
    const request = {
      apartment: apartment._id,
      apartmentName: apartment.name,
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
    const paymentHistory = await PaymentHistoryModel.create(calTotalPay(request));
    return res.status(200).json(succesResponseObj(paymentHistory));
  }
  if (req.query.block) {
    const block = await BlockModel.findById(req.query.block);
    if (!block) return next(NewError('block not found', 404));
    const apartments = await ApartmentModel.find({block: req.query.block});
    const eIndexHistory = await IndexHistoryModel.find({
      apartment: req.query.block,
      typeIndex: 'CSD',
    })
      .sort({ createdAt: -1 })
    const wIndexHistory = await IndexHistoryModel.find({
      apartment: req.query.block,
      typeIndex: 'CSN',
    })
      .sort({ createdAt: -1 })
    let request = [];
    apartments.forEach(apartment => {
      const eIndexHistoryFilter = eIndexHistory.filter(item => item.apartment === apartment._id)
      const wIndexHistoryFilter = wIndexHistory.filter(item => item.apartment === apartment._id)
      const elm = {
        apartment: apartment._id,
        apartmentName: apartment.name,
        unitPrice: apartment.price,
        CSD: { CSM: eIndexHistoryFilter[0].index || 0, CSC: eIndexHistoryFilter[1].index || 0 },
        CSN: { CSM: wIndexHistoryFilter[0].index || 0, CSC: wIndexHistoryFilter[1].index || 0 },
        nPerson: apartment.nPerson,
        pElectric: block.pElectric,
        pWater: block.pWater,
        pTrash: block.pTrash,
        pInternet: block.pInternet,
        nBike: apartment.nBike,
        pBike: block.pBike,
        nAutoBike: apartment.nAutoBike,
        pAutoBike: block.pAutoBike,
      }
      request.push(calTotalPay(elm));
    })
    const paymentHistory = await PaymentHistoryModel.create(request);
    return res.status(200).json(succesResponseObj(paymentHistory));
  }
  return next(NewError('invalid input', 400))
});

export default { createApartment, getAllApartment, checkIn, checkOut, createBill };
