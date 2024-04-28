const router = require("express").Router();
const { NOT_FOUND_ERROR } = require("../utils/errors");
const { createUser, getCurrentUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

// const userRouter = require("./users");
const itemRouter = require("./clothingItems");

// router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", auth, login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Requested resource not found" });
});

module.exports = router;
