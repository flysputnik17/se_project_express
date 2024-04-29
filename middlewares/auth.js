const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const { INCORRECT_ERROR } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  console.log("\nauthorization:", authorization);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(INCORRECT_ERROR)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  console.log("\ntoken: ", token);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("\nerror:", err);
    return res
      .status(INCORRECT_ERROR)
      .send({ message: "Authorization required" });
  }
  req.user = payload;
  return next();
};
