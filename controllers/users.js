const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  SERVER_ERROR,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Not found" });
      }
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const upDateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password) {
    res
      .status(BadRequestError)
      .send({ message: "Email or password incorrect" });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(ConflictError).send({
          message: "This email is already registered",
        });
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ email, password: hash, name, avatar }))
        .then((newUser) => {
          const payload = newUser.toObject();
          delete payload.password;
          console.log("backend test");
          res.status(201).send({ data: payload });
        });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  if (!email || !password) {
    res
      .status(BadRequestError)
      .send({ message: "Email or password incorrect" });
    return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect password or email") {
        return res
          .status(UnauthorizedError)
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
  upDateCurrentUser,
};
