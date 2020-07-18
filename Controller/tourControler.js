//const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

//dest refears to destinations
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([{
    name: 'imageCover',
    maxCount: 1
  },
  {
    name: 'images',
    maxCount: 3
  }
]);

// upload.single('image') req.file
// upload.array('images',5) req.files
exports.resizeTourimages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();
  //1)Cover images
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({
      quality: 90
    })
    .toFile(`public/img/tours/${req.body.imageCover}`);
  //2)Images 
  req.body.images = [];
  await Promise.all(req.files.images.map(async (file, i) => {
    const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({
        quality: 90
      })
      .toFile(`public/img/tours/${filename}`);
    req.body.images.push(filename);

  }));
  console.log();
  next();
});
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   // eslint-disable-next-line no-console
//   console.log(`The id is ${val}.`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price!😥'
//     });
//   }
//   next();
// };

exports.topTourAlias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,difficulty,summary';
  next();
};


// exports.getAllTours = catchAsync(async (req, res, next) => {
//   //console.log(req.requestTime);

//   //console.log(req.query);
//   //Build query
//   //1(A).Filtering

//   // const queryObj = { ...req.query };
//   // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   // excludedFields.forEach(el => delete queryObj[el]);
//   // //2(B).AdvanceFiltering
//   // let queryStr = JSON.stringify(queryObj);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//   // //console.log(JSON.parse(queryStr));
//   // //{difficulty:'easy',durations:{gte:5}}
//   // //{ difficulty: 'easy', maxGroupSize: { gte: '8' } }
//   // let query = Tour.find(JSON.parse(queryStr));
//   //2.sorting://
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   query = query.sort(sortBy);
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }
//   //3.limit://
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   query = query.select(fields);
//   // } else {
//   //   query = query.select('-__v');
//   // }
//   //4.pagination//
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);
//   // if (req.query.page) {
//   //   const numTours = await Tour.countDocuments();
//   //   if (skip >= numTours)
//   //     throw new Error('Sorry This page is not Available!😢');
//   // }
//   //excute Query
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filtering()
//     .sorting()
//     .limiting()
//     .pagination();
//   const tours = await features.query;
//   // const tours =  Tour.find()
//   //   .where('duration')
//   //   .equals(5)
//   //   .where('difficulty')
//   //   .equals('easy');
//   //response send
//   res.status(200).json({
//     status: 'success',
//     total_tour: tours.length,
//     data: {
//       tours
//     }
//   });
// });



exports.getTourStats = catchAsync(async (req, res, next) => {

  const stats = await Tour.aggregate([{
      $match: {
        ratingsAverage: {
          $gte: 4.5
        }
      }
    },
    {
      $group: {
        //_id: '$price',
        _id: {
          $toUpper: '$difficulty'
        },
        numTours: {
          $sum: 1
        },
        numRatings: {
          $sum: '$ratingsQuantity'
        },
        avgRating: {
          $avg: '$ratingsAverage'
        },
        avgPrice: {
          $avg: '$price'
        },
        minPrice: {
          $min: '$price'
        },
        maxPrice: {
          $max: '$price'
        }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

// exports.getTours = (req, res) => {
//   // eslint-disable-next-line no-console
//   console.log(req.params);
//   const id = req.params.id * 1;
//   //const tour = tours.find(el => el.id === id);
//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       tour
//   //     }
//   //   });
// };




// exports.getTours = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   if (!tour) {
//     return next(new AppError('The tour is not found in this id', 404));
//   }

//   //Tour.findOne({_id:req.params.id})
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });

// });



// exports.createNewTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tours: newTour
//     }
//   });
//   // try {
//   //   const newTour = new Tour({});
//   //   newTour.save();

//   //               Short form 👇


//   //   no need in api project
//   //     const newID = tours[tours.length - 1].id + 1;
//   //     const newTour = {
//   //       id: newID,
//   //       BODY: req.body
//   //     };
//   //     tours.push(newTour);
//   //     fs.writeFile(
//   //       `${__dirname}/../dev-data/data/tours-simple.json`,
//   //       JSON.stringify(tours),
//   //       err => {
//   //         res.status(201).json({
//   //           status: 'success',
//   //           data: {
//   //             tours: newTour
//   //           }
//   //         });
//   //         // eslint-disable-next-line no-console
//   //         console.log(err);
//   //       }
//   //     );  err => {
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'Error',
//   //     message: err
//   //   });
//   // }
// });




// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });
//   if (!tour) {
//     return next(new AppError('The tour is not found in this id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });


exports.getAllTours = factory.getAll(Tour);
exports.getTours = factory.getOne(Tour, {
  path: 'reviews'
});
exports.createNewTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);


// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('The tour is not found in this id', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

  const year = req.params.year * 1;
  const plan = await Tour.aggregate([{
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        },
        numOfTourStarts: {
          $sum: 1
        },
        tours: {
          $push: '$name'
        }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numOfTourStarts: -1
      }
    },
    {
      $limit: 6
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

//GeoSpatial Queries finding tour

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/40.733580856615326, -74.16649051934947/unit/mi
//lat = latitude & lan = longitude

// '/tours-within/:distance/center/:latlng/unit/:unit'
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/33.420755, -95.781260/unit/mi

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const {
    distance,
    latlng,
    unit
  } = req.params;
  const [lat, lng] = latlng.split(',');

  // const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 400));
  }

  // console.log(distance, lat, lng, unit);

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat], radius
        ]
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const {
    latlng,
    unit
  } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 400));
  }

  const distances = await Tour.aggregate([{
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});