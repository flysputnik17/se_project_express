const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/customErrors");

const itemRouter = require("./clothingItems");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

router.use("/items", itemRouter);

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);

router.use((next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
