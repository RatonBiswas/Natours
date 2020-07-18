const express = require('express');
const userControler = require('../Controller/userControler');
const authController = require('../Controller/authController');




const routers = express.Router();


routers.post('/signup', authController.signup);
routers.post('/login', authController.login);
routers.get('/logout', authController.logout);


routers.post('/forgotPassword', authController.forgotPassword);
routers.patch('/resetPassword/:token', authController.resetPassword);


//Protect All Routes After this middleware!
routers.use(authController.protect);

routers.get('/me', userControler.getMe, userControler.getUser);
routers.patch('/updateMyPassword', authController.updatePassword);
routers.patch('/updateMe', userControler.uploadUserPhoto, userControler.resizeUserPhoto, userControler.updateMe);
routers.delete('/deleteMe', userControler.deleteMe);


//Protect all of this route to admin
routers.use(authController.restrictTo('admin'));

routers
  .route('/')
  .get(userControler.getAllusers)
  .post(userControler.createNewUsers);
routers
  .route('/:id')
  .get(userControler.getUser)
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser);




module.exports = routers;