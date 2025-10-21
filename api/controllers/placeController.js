const Place = require("../models/Place");
const { validationResult } = require("express-validator");

// @desc    Get all places
// @route   GET /api/places
// @access  Public
exports.getAllPlaces = async (req, res) => {
  try {
    const { tags, minRating, limit = 20, page = 1 } = req.query;

    let query = {};

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Filter by minimum rating
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    const places = await Place.find(query)
      // .populate('createdBy', 'name')
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name" },
        options: { limit: 5, sort: { createdAt: -1 } },
      })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Place.countDocuments(query);

    res.status(200).json({
      success: true,
      count: places.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: places,
    });
  } catch (error) {
    console.error("Get all places error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single place
// @route   GET /api/places/:id
// @access  Public
exports.getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name" },
        options: { sort: { createdAt: -1 } },
      });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    console.error("Get place error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create new place
// @route   POST /api/places
// @access  Private
exports.createPlace = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, image, longitude, latitude, summary, tags } = req.body;

    const place = await Place.create({
      title,
      image,
      longitude,
      latitude,
      summary,
      tags: tags || [],
      createdBy: req.user.id,
    });

    const populatedPlace = await Place.findById(place._id).populate(
      "createdBy",
      "name email",
    );

    res.status(201).json({
      success: true,
      data: populatedPlace,
    });
  } catch (error) {
    console.error("Create place error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during place creation",
    });
  }
};

// @desc    Update place
// @route   PUT /api/places/:id
// @access  Private
exports.updatePlace = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // Check if user can update this place
    if (!place.canBeUpdatedBy(req.user.id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this place",
      });
    }

    const { title, image, longitude, latitude, summary, tags } = req.body;

    place = await Place.findByIdAndUpdate(
      req.params.id,
      { title, image, longitude, latitude, summary, tags },
      { new: true, runValidators: true },
    ).populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    console.error("Update place error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete place
// @route   DELETE /api/places/:id
// @access  Private
exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // Check if user can delete this place
    if (!place.canBeUpdatedBy(req.user.id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this place",
      });
    }

    // Delete all reviews associated with this place
    const Review = require("../models/Review");
    await Review.deleteMany({ place: place._id });

    await place.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Place and associated reviews deleted successfully",
    });
  } catch (error) {
    console.error("Delete place error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get places near location
// @route   GET /api/places/nearby/:longitude/:latitude
// @access  Public
exports.getPlacesNearby = async (req, res) => {
  try {
    const { longitude, latitude } = req.params;
    const { maxDistance = 10000 } = req.query; // Default 10km

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lon) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    // Calculate distance using Haversine formula
    const places = await Place.find().populate("createdBy", "name email");

    const placesWithDistance = places
      .map((place) => {
        const R = 6371e3; // Earth radius in meters
        const φ1 = (lat * Math.PI) / 180;
        const φ2 = (place.latitude * Math.PI) / 180;
        const Δφ = ((place.latitude - lat) * Math.PI) / 180;
        const Δλ = ((place.longitude - lon) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;

        return {
          ...place.toObject(),
          distance: Math.round(distance),
        };
      })
      .filter((place) => place.distance <= parseFloat(maxDistance))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: placesWithDistance.length,
      data: placesWithDistance,
    });
  } catch (error) {
    console.error("Get nearby places error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
