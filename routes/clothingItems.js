const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../api/clothingItems");
const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/", getItems);

router.use(auth);

router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateId, deleteItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, unlikeItem);

module.exports = router;
