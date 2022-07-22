const express = require('express');
const {getAllReviews, top3reviews, getPlanReview, createReview, updateReview, deleteReview} = require('../controller/reviewController');
const {protectRoute} = require('../controller/authController');

const reviewRouter = express.Router();

reviewRouter.route('/all')
.get(getAllReviews)

reviewRouter.route('/top3')
.get(top3reviews)

reviewRouter.route('/:planId')
.get(getPlanReview)

reviewRouter.use(protectRoute);
reviewRouter.route('/crud/:planId')
.post(createReview)
.patch(updateReview)
.delete(deleteReview)




module.exports = reviewRouter;