const Item = require("../models/clothingItems");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((newItem) => res.status(201).send({ data: newItem }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(ForbiddenError)
          .send({ message: "You are not authorized to delete this item." });
      }
      return item.deleteOne().then(() => {
        res.send({ message: "Item deleted" });
      });
    })
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

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
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

const unlikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
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

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
