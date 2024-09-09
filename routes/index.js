const express = require("express");

const router = express.Router();
const { createUser, login } = require("../api/users");
const userRouter = require("./users");
const NotFoundError = require("../utils/NotFoundError");

const itemRouter = require("./clothingItems");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  console.log(`Requested URL: ${req.originalUrl}`);
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
