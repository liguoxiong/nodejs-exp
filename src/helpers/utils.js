import NodeGeocoder from 'node-geocoder'

export const asyncCatchError = fn =>  (req, res, next) => {
    fn(req, res, next).catch(next);
};

const geocoderOptions = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

export const geocoder = NodeGeocoder(geocoderOptions);