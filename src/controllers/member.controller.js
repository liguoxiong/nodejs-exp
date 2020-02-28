import { MemberModel } from "../models";
import { asyncCatchError, succesResponseObj } from "../helpers/utils";

const createMember = asyncCatchError(async (req, res, next) => {

  const member = await MemberModel.create(req.body);

  res.status(201).json(succesResponseObj(member));
});

const getAllMember = asyncCatchError(async (req, res) => {
  res.status(200).json(res.getResults);
});

export default { createMember, getAllMember };
