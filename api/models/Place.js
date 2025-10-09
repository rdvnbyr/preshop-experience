const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    image: {
      src: {
        type: String,
        required: [true, "Please provide an image source"],
      },
      alt: {
        type: String,
        default: "",
      },
      thumbnail: {
        type: String,
        default: "",
      },
    },
    longitude: {
      type: Number,
      required: [true, "Please provide longitude"],
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"],
    },
    latitude: {
      type: Number,
      required: [true, "Please provide latitude"],
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"],
    },
    summary: {
      type: String,
      required: [true, "Please provide a summary"],
      trim: true,
      maxlength: [1000, "Summary cannot be more than 1000 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
placeSchema.index({ longitude: 1, latitude: 1 });

// Virtual for location
placeSchema.virtual("location").get(function () {
  return {
    type: "Point",
    coordinates: [this.longitude, this.latitude],
  };
});

placeSchema.set("toJSON", {
  virtuals: true, // include virtuals like `location`
  versionKey: false, // remove __v
  transform: function (doc, ret) {
    const { _id, ...rest } = ret;
    return {
      id: _id.toString(),
      ...rest,
    };
  },
});

// Method to check if user can update this place
placeSchema.methods.canBeUpdatedBy = function (userId, userRole) {
  // SuperUser and Admin can update any place
  if (userRole === "superUser" || userRole === "admin") {
    return true;
  }
  // Creator can update their own place
  return this.createdBy.toString() === userId.toString();
};

// Method to calculate average rating
placeSchema.methods.calculateAverageRating = async function () {
  const Review = mongoose.model("Review");
  const stats = await Review.aggregate([
    {
      $match: { place: this._id },
    },
    {
      $group: {
        _id: "$place",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    this.averageRating = Math.round(stats[0].averageRating * 10) / 10;
    this.reviewCount = stats[0].reviewCount;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }

  await this.save();
};

// response _id to id by fetching places or place

module.exports = mongoose.model("Place", placeSchema);
