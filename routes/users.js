const router = require("express").Router();
const { getCurrentUser, upDateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateUserUpdate,
  validateAuthentication,
} = require("../middlewares/validation");

router.use(auth);

router.get("/me", validateAuthentication, getCurrentUser);
router.patch("/me", validateUserUpdate, upDateCurrentUser);

module.exports = router;
