const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getMyReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Validation rules
const reviewValidation = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required')
];

// Place-specific review routes
router.route('/')
    .get(getReviews)
    .post(protect, reviewValidation, createReview);

// General review routes
router.get('/my-reviews', protect, getMyReviews);
router.route('/:id')
    .put(protect, reviewValidation, updateReview)
    .delete(protect, deleteReview);

module.exports = router;
