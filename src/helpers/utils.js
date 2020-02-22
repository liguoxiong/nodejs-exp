import NodeGeocoder from "node-geocoder";
require("dotenv").config();

export const asyncCatchError = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

const geocoderOptions = {
  appId: process.env.GEOCODER_APPID,
  // appCode: process.env.GEOCODER_APPCODE,
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
  language: "VI",
  country: "Vietnam",
  production: process.env.NODE_ENV === "production"
};

export const geocoder = NodeGeocoder(geocoderOptions);
