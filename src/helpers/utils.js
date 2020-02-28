import NodeGeocoder from 'node-geocoder';
require('dotenv').config();

export const asyncCatchError = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const geocoderOptions = {
  appId: process.env.GEOCODER_APPID,
  // appCode: process.env.GEOCODER_APPCODE,
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
  language: 'VI',
  country: 'Vietnam',
  production: process.env.NODE_ENV === 'production',
};

export const geocoder = NodeGeocoder(geocoderOptions);

const genSlug = (num, res=[]) => {
  const dict = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'];
  res.unshift(dict[num%dict.length]);
  if (num - num%dict.length > 0) {
    genSlug(Math.floor(num/dict.length), res)
  }
  return res;
} 

export const genUniqueCode = () => {
  const newDate = new Date();
  const startDate = new Date("2020-02-15");
  const result = (newDate - startDate);
  return genSlug(result).join('');
}

export const succesResponseObj = data => ({
  status: 'success',
  data,
})
