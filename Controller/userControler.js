const multer =  require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


// const multerStorage = multer.diskStorage({
//   destination : (req,file,cb)=>{
//     cb(null,'public/img/users');
//   },
//   filename:(req,file,cb)=>{
//     //user -76767676abc7676dba.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }else{
    cb(new AppError('Not an image! Please upload only images.',400),false);
  }
};

//dest refears to destinations
const upload = multer({ 
    storage:multerStorage,
    fileFilter:multerFilter
});

exports.uploadUserPhoto=upload.single('photo');
exports.resizeUserPhoto=catchAsync(async(req, res,next)=>{
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  if(!req.file) return next();
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality : 90})
  .toFile(`public/img/users/${req.file.filename}`);
  next();
});


const filterObj = (obj,...allowedFields)=> {
  const newObj = {};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el)) newObj[el]= obj[el];
  });
  return newObj;
}
// exports.getAllusers = catchAsync(async(req, res,next) => {
//     const users = await User.find();
//     //send responses
//     res.status(200).json({
//       status: 'success',
//       total_users: users.length,
//       data: {
//         users
//       }
//     });
// });



exports.createUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route yet not defined!Please use/signup instead'
    });
}



// exports.getUser = catchAsync(async(req, res,next) => {
//     const user = await User.findById(req.params.id);
//   if (!user) {
//     return next(new AppError('The user is not found in this id', 404));
//   }
//   //Tour.findOne({_id:req.params.id})
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user
//     }
//   });
// });

exports.getMe = (req, res, next)=>{
  req.params.id = req.user.id;
  next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  //1) create error if user post data
  if(req.body.password||req.body.passwordConfirm){
    return next(new AppError('This route is not for password updates.Please use updateMyPassword',400));
  }
  //2)filterd out unwanted names that are not allowed to be updated
  const filteredBody = filterObj(req.body,'name','email');
  if (req.file) filteredBody.photo = req.file.filename;
  //3)Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true});
  res.status(200).json({
    status: 'success',
    data:{
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id,{active:false});
   res.status(200).json({
     status: 'success',
     data: null
   })
});

//Do not update password with that!

// exports.updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route yet not defined'
//     });
// }



// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route yet not defined'
//     });
// }

exports.getAllusers = factory.getAll(User);
exports.createNewUsers = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); //Do not update password with that!
exports.deleteUser = factory.deleteOne(User); //Do not update password with that!