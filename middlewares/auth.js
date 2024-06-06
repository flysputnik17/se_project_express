const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../utils/customErrors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UnauthorizedError)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    const err = new Error("Authorization required");
    err.statusCode = UnauthorizedError;
    next(err);
  }
  req.user = payload;
  return next();
};
