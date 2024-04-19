const Item = require("../models/clothingItems");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch(() => res.status(500).send({ message: "no items in DB" }));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl })
    .then((newItem) => res.status(201).send({ data: newItem }))
    .catch(() => res.status(500).send({ message: "item not created" }));
};

// const deleteItem = (req, res) => {
//   Item.delete();
// };

module.exports = {
  getItems,
  createItem,
};
