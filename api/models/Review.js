const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
        trim: true,
        maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews from same user on same place
reviewSchema.index({ user: 1, place: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
