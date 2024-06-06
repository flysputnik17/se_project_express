const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

// const {
//   BAD_REQUEST_ERROR,
//   NOT_FOUND_ERROR,
//   CONFLICT_ERROR,
//   INCORRECT_ERROR,
//   SERVER_ERROR,
// } = require("../utils/errors");

const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require("../utils/customErrors");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const upDateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))

    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }

      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not found"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email or password incorrect"));
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError("This email is already registered"));
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
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log("email", email);
  if (!email || !password) {
    next(new BadRequestError("Email or password incorrect"));
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect password or email") {
        next(new UnauthorizedError("Incorrect password or email"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  upDateCurrentUser,
};
