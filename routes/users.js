const router = require("express").Router();
const { getCurrentUser, upDateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", upDateCurrentUser);

module.exports = router;
