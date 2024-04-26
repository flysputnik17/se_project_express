const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." })
    );
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
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
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "A user with this email already exists" });
      }
      return bcrypt.hash(password, 10).then((hash) =>
        User.create({ name, avatar, email, password: hash })
          .then(() => res.status(201).send(user))
          .catch((err) => {
            if (err.name === "ValidationError") {
              return res
                .status(BAD_REQUEST_ERROR)
                .send({ message: "Invalid data" });
            }
            return res
              .status(SERVER_ERROR)
              .send({ message: "An error has occurred on the server." });
          })
      );
    })
    .catch((err) => {
      console.error(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
