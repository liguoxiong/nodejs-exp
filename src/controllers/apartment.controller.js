import {
  ApartmentModel,
  BlockModel,
  IndexHistoryModel,
  PaymentHistoryModel
} from "../models";
import {
  asyncCatchError,
  succesResponseObj,
  resultNumber
} from "../helpers/utils";
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
  const {
    cusName,
    price,
    cusAddress,
    nPerson,
    nBike,
    nAutoBike,
    startDate
  } = req.body;
  apartment = await ApartmentModel.findByIdAndUpdate(
    req.params.id,
    {
      status: 1,
      cusName,
      cusAddress,
      nPerson,
      nBike,
      nAutoBike,
      price,
      startDate
    },
    {
      new: true,
      runValidators: true
    }
  ).populate([
    { path: "CSD", select: ["index", "_id"] },
    { path: "CSN", select: ["index", "_id"] }
  ]);
  res.status(200).json(succesResponseObj(apartment));
});

const checkOut = asyncCatchError(async (req, res, next) => {
  let apartment = await ApartmentModel.findById(req.params.id);
  if (!apartment) return next(new NewError("apartment not found", 404));
  apartment = await ApartmentModel.findByIdAndUpdate(
    req.params.id,
    {
      status: 0,
      cusName: "",
      cusAddress: "",
      nPerson: 0,
      nBike: 0,
      nAutoBike: 0
    },
    {
      new: true,
      runValidators: true
    }
  ).populate([
    { path: "CSD", select: ["index", "_id"] },
    { path: "CSN", select: ["index", "_id"] }
  ]);
  res.status(200).json(succesResponseObj(apartment));
});

const createBill = asyncCatchError(async (req, res, next) => {
  const calTotalPay = apartmentPay => {
    const totalE = resultNumber(
      apartmentPay.pElectric.per === "unit"
        ? apartmentPay.pElectric.price *
            (apartmentPay.CSD.CSM - apartmentPay.CSD.CSC)
        : apartmentPay.pElectric.price * apartmentPay.nPerson
    );
    const totalW = resultNumber(
      apartmentPay.pWater.per === "unit"
        ? apartmentPay.pWater.price *
            (apartmentPay.CSN.CSM - apartmentPay.CSN.CSC)
        : apartmentPay.pWater.price * apartmentPay.nPerson
    );
    const totalBike = resultNumber(apartmentPay.nBike * apartmentPay.pBike);
    const totalAutoBike = resultNumber(
      apartmentPay.nAutoBike * apartmentPay.pAutoBike
    );
    const totalTrash = resultNumber(
      apartmentPay.pTrash.per === "unit"
        ? apartmentPay.pTrash.price
        : apartmentPay.pTrash * apartmentPay.nPerson
    );
    const totalI = resultNumber(
      apartmentPay.pInternet.per === "unit"
        ? apartmentPay.pInternet.price
        : apartmentPay.pInternet.price * apartmentPay.nPerson
    );
    let total =
      resultNumber(apartmentPay.price) +
      totalE +
      totalW +
      totalBike +
      totalAutoBike +
      totalTrash +
      totalI;
    // console.log(totalE, totalW, totalBike, totalAutoBike, totalI, totalTrash, apartmentPay.price)
    return { ...apartmentPay, total };
  };
  if (req.query.apartment) {
    const apartment = await ApartmentModel.findById(req.params.id);
    if (!apartment) return next(NewError("apartment not found", 404));
    if (apartment.status === 0)
      return next(NewError("apartment not for rent", 400));
    const eIndexHistory = await IndexHistoryModel.find({
      apartment: req.query.apartment,
      typeIndex: "CSD"
    })
      .sort({ createdAt: -1 })
      .limit(2);
    const wIndexHistory = await IndexHistoryModel.find({
      apartment: req.query.apartment,
      typeIndex: "CSN"
    })
      .sort({ createdAt: -1 })
      .limit(2);
    const block = await BlockModel.findById(apartment.block);
    const request = {
      apartment: apartment._id,
      apartmentName: apartment.name,
      unitPrice: apartment.price,
      CSD: {
        CSM: eIndexHistory.length ? eIndexHistory[0].index : 0,
        CSC: eIndexHistory.length > 1 ? eIndexHistory[1].index : 0
      },
      CSN: {
        CSM: wIndexHistory.length ? wIndexHistory[0].index : 0,
        CSC: wIndexHistory.length > 1 ? wIndexHistory[1].index : 0
      },
      nPerson: apartment.nPerson,
      pElectric: block.pElectric,
      pWater: block.pWater,
      pTrash: block.pTrash,
      pInternet: block.pInternet,
      nBike: apartment.nBike,
      pBike: block.pBike,
      nAutoBike: apartment.nAutoBike,
      pAutoBike: block.pAutoBike
    };
    const paymentHistory = await PaymentHistoryModel.create(
      calTotalPay(request)
    );
    return res.status(200).json(succesResponseObj(paymentHistory));
  }
  if (req.query.block) {
    const block = await BlockModel.findById(req.query.block);
    if (!block) return next(NewError("block not found", 404));
    const apartments = await ApartmentModel.find({
      block: req.query.block,
      status: 1
    });
    const eIndexHistory = await IndexHistoryModel.find({
      block: req.query.block,
      typeIndex: "CSD"
    }).sort({ createdAt: -1 });
    const wIndexHistory = await IndexHistoryModel.find({
      block: req.query.block,
      typeIndex: "CSN"
    }).sort({ createdAt: -1 });
    let request = [];
    apartments.forEach(apartment => {
      const eIndexHistoryFilter = eIndexHistory.filter(item => {
        return item.apartment.toString() === apartment._id.toString();
      });
      const wIndexHistoryFilter = wIndexHistory.filter(
        item => item.apartment === apartment._id
      );
      const elm = {
        apartment: apartment._id,
        apartmentName: apartment.name,
        unitPrice: apartment.price,
        CSD: {
          CSM: eIndexHistoryFilter.length ? eIndexHistoryFilter[0].index : 0,
          CSC: eIndexHistoryFilter.length > 1 ? eIndexHistoryFilter[1].index : 0
        },
        CSN: {
          CSM: wIndexHistoryFilter.length ? wIndexHistoryFilter[0].index : 0,
          CSC: wIndexHistoryFilter.length > 1 ? wIndexHistoryFilter[1].index : 0
        },
        nPerson: apartment.nPerson,
        pElectric: block.pElectric,
        pWater: block.pWater,
        pTrash: block.pTrash,
        pInternet: block.pInternet,
        nBike: apartment.nBike,
        pBike: block.pBike,
        nAutoBike: apartment.nAutoBike,
        pAutoBike: block.pAutoBike
      };
      request.push(calTotalPay(elm));
    });
    const paymentHistory = await PaymentHistoryModel.create(request);
    return res.status(200).json(succesResponseObj(paymentHistory));
  }
  return next(NewError("invalid input", 400));
});

export default {
  createApartment,
  getAllApartment,
  checkIn,
  checkOut,
  createBill
};
