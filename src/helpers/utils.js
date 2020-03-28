require('dotenv').config();

export const asyncCatchError = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const genSlug = (num, res=[]) => {
  const dict = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'];
  res.unshift(dict[num%dict.length]);
  if (num - num%dict.length > 0) {
    genSlug(Math.floor(num/dict.length), res)
  }
  return res;
} 

export const succesResponseObj = data => ({
  status: 'success',
  data,
})

export const resultNumber = value => (value ? value : 0)
