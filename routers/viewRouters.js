const express = require('express');
const viewsController = require('./../Controller/viewsController');
const authController = require('./../Controller/authController');
const bookingController = require('./../Controller/bookingController');

const routers = express.Router();

routers.get('/',bookingController.createBookingCheckout,authController.isLoggedIn, viewsController.getOverview);
routers.get('/tour/:slug',authController.isLoggedIn, viewsController.getTour);
routers.get('/login',authController.isLoggedIn, viewsController.getLoginForm);
routers.get('/me', authController.protect, viewsController.getAccount);
routers.get('/my-tours', authController.protect, viewsController.getMyTours);

routers.post('/submit-user-data',authController.protect, viewsController.updateUserData);
//routers.post('/submmit-user-password',authController.protect, viewsController.updateUserPassword);

module.exports = routers;