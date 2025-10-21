const Review = require("../models/Review");
const Place = require("../models/Place");
const { validationResult } = require("express-validator");

// @desc    Get all reviews for a place
// @route   GET /api/places/:placeId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ place: req.params.placeId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create review for a place
// @route   POST /api/places/:placeId/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { rating, comment } = req.body;
    const placeId = req.params.placeId;

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // Check if user already reviewed this place
    const existingReview = await Review.findOne({
      user: req.user.id,
      place: placeId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this place",
      });
    }

    // Create review
    const review = await Review.create({
      rating,
      comment,
      user: req.user.id,
      place: placeId,
    });

    // Add review to place
    place.reviews.push(review._id);
    await place.save();

    // Recalculate average rating
    await place.calculateAverageRating();

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name email",
    );

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during review creation",
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns this review
    if (
      review.user.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "superUser"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    const { rating, comment } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true },
    ).populate("user", "name email");

    // Recalculate average rating for the place
    const place = await Place.findById(review.place);
    if (place) {
      await place.calculateAverageRating();
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns this review or is admin/superUser
    if (
      review.user.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "superUser"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const placeId = review.place;

    await review.deleteOne();

    // Remove review from place
    const place = await Place.findById(placeId);
    if (place) {
      place.reviews = place.reviews.filter(
        (r) => r.toString() !== req.params.id,
      );
      await place.save();
      await place.calculateAverageRating();
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate("place", "title image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get my reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
