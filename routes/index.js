const router = require("express").Router();
const { NOT_FOUND_ERROR } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");

const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Requested resource not found" });
});

module.exports = router;
