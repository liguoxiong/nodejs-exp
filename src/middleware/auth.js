import jwt from "jsonwebtoken";
import NewError from "../helpers/NewError";
import { asyncCatchError } from "../helpers/utils";

const auth = asyncCatchError((req, res, next) => {
  //get the token from the header if present

  let token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token)
    return next(new NewError("Access denied. No token provided.", 401));

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  //if can verify the token, set req.user and pass to next middleware
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  req.user = decoded;
  next();
});

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 0) {
    return res.status(401).json({
      status: "fail",
      message: "Access denied"
    });
  }
  next();
};

export default auth;
