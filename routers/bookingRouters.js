const express = require('express');
const bookingController = require('./../Controller/bookingController');
const authController = require('./../Controller/authController');

const routers = express.Router();

routers.use(authController.protect);

routers.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

routers.use(authController.restrictTo('admin', 'lead-guide'));

routers.route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

routers.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = routers;