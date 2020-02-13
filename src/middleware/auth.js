import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  //get the token from the header if present

  let token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 0) {
    return res.status(401).json({
      success: false,
      message: "Access denied"
    });
  }
  next();
};

export default auth;
