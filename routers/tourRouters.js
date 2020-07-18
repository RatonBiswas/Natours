const express = require('express');
const tourControler = require('../Controller/tourControler');
const authController = require('../Controller/authController');
const reviewRouter = require('./reviewRouters');
//const reviewController = require('./../Controller/reviewController');
const routers = express.Router();

//routers.param('id', tourControler.checkId);


// //POST / tour/234jkjsf2/reviews
// //GET/tour/123nkks4/reviews 
// //GET/tour/wwnjrkjn23/reviews/21241
// routers
//   .route('/:tourId/reviews')
//   .post(authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );



routers.use('/:tourId/reviews', reviewRouter);


routers
  .route('/top-5-cheap')
  .get(tourControler.topTourAlias, tourControler.getAllTours);


routers
  .route('/tour-stats')
  .get(tourControler.getTourStats);


routers
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourControler.getMonthlyPlan);

routers
.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourControler.getToursWithin);
  // tours-within?distance=233,center=-40,45,unit=mi
  //tours-within/233/center/-40,45/unit/mi

routers.route('/distances/:latlng/unit/:unit').get(tourControler.getDistances);

routers
  .route('/')
  .get(authController.protect, tourControler.getAllTours)
  .post( /*tourControler.checkBody*/ authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControler.createNewTour);

routers
  .route('/:id')
  .get(tourControler.getTours)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControler.uploadTourImages,
    tourControler.resizeTourimages,
    tourControler.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControler.deleteTour
  );



module.exports = routers;