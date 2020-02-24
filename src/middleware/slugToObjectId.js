import mongoose from 'mongoose';

const objectId = mongoose.Types.ObjectId

const slugToObjectId = (model, param) => async (req, res, next) => {
  console.log(req.query)
  if (req.query[param]) {
      if (!objectId.isValid(req.query[param])) {
        const res = await model.findOne({ slug: req.query[param]})
        console.log(res);
        req.query[param] = res._id
      }
  }
  next();
}

export default slugToObjectId;