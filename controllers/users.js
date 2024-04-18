const User = require("../models/users");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: "now such user in DB" }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: "user not created!" }));
};
