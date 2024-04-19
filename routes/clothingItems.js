const router = require("express").Router();
const { getItems, createItem } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);

module.exports = router;
