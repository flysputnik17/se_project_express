const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  INCORRECT_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error("\nerror is:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Email or password incorrect" });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(CONFLICT_ERROR).send({
          message: "This email is already registered",
        });
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((newUser) => {
          const payload = newUser.toObject();
          delete payload.password;
          res.status(201).send({ data: payload });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Email or password incorrect" });
    return;
  }
  console.log("The password is:", password);
  console.log("The email is:", email);
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error("\nerror is:", err);
      if (err.message === "Incorrect password or email") {
        return res
          .status(INCORRECT_ERROR)
          .send({ message: "Incorrect password or email" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
};
