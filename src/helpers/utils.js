import NodeGeocoder from 'node-geocoder'

export const asyncCatchError = fn =>  (req, res, next) => {
    fn(req, res, next).catch(next);
};

const geocoderOptions = {
  appCode: process.env.GEOCODER_APPID,
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
  language: 'VI',
  country: 'Vietnam'
};

export const geocoder = NodeGeocoder(geocoderOptions);