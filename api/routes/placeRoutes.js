const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getAllPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  getPlacesNearby,
} = require("../controllers/placeController");
const { protect } = require("../middleware/auth");
const httpLogger = require("../middleware/http-logger");

// Use http logger
router.use(httpLogger);

// Validation rules
const placeValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("image.src").notEmpty().withMessage("Image source is required"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  body("summary").trim().notEmpty().withMessage("Summary is required"),
];

// Public routes
router.get("/", getAllPlaces);
router.get("/nearby/:longitude/:latitude", getPlacesNearby);
router.get("/:id", getPlace);

// Protected routes
router.post("/", protect, placeValidation, createPlace);
router.put("/:id", protect, placeValidation, updatePlace);
router.delete("/:id", protect, deletePlace);

module.exports = router;
