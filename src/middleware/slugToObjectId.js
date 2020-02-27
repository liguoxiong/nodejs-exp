import { asyncCatchError } from "../helpers/utils";
import NewError from '../helpers/NewError'

// const objectId = mongoose.Types.ObjectId

const slugToObjectId = (model, param) => asyncCatchError(async (req, res, next) => {
  if (req.query[param]) {
    const res = await model.findOne({ slug: req.query[param]})
    if (!res) {
      return next(new NewError('Invalid Input', 400));
    }
    req.query[param] = res._id
  }
  next();
});

export default slugToObjectId;