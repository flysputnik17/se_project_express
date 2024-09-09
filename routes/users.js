const express = require("express");

const router = express.Router();
const { getCurrentUser, upDateCurrentUser } = require("../api/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, upDateCurrentUser);

module.exports = router;
