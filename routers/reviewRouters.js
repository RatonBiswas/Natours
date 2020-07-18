const express = require('express');
const reviewController = require('./../Controller/reviewController');
const authController = require('./..//Controller/authController');

const routers = express.Router({
    mergeParams: true
});

//POST /tour/234jkjsf2/reviews
//POST /reviews

//Protect All reviews to all user
routers.use(authController.protect);

routers
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview);
routers
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview)
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview);

module.exports = routers;