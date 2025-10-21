const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const httpLogger = require("../middleware/http-logger");

// Use http logger
router.use(httpLogger);

// All routes are protected
router.use(protect);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
