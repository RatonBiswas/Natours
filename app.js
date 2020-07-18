const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRoutes = require('./routers/tourRouters');
const userRoutes = require('./routers/userRouters');
const reviewRoutes = require('./routers/reviewRouters');
const bookingRoutes = require('./routers/bookingRouters');
const viewRoutes = require('./routers/viewRouters');

const globalErrorHandler = require('./Controller/errorController');
const AppError = require('./utils/appError');

//Start express App
const app = express();

//Use template pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1. Global Middleware
// Set security HTTP headers
app.use(helmet());

//Development logging basically
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP , please try again in an hour💥!',
});
app.use('/api', limiter);

//Body perser,Reading data from body into req.body
app.use(express.json({
  limit: '10kb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}));
app.use(cookieParser());

//Data sanitize against NoSQL query Injection
app.use(mongoSanitize());

//Data sanitize against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Serving Static Files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   // eslint-disable-next-line no-console
//   console.log('This is middleware apps');
//   next();
// });

app.use(compression());

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies); 
  next();
});
// Middleware is basically a function that can modify incomming request data.

// app.get('/', (req, res) => {
//     res.status(200)
//         .json({
//             message: 'Hello from the server site.👌',
//             app: 'Natours'
//         });
// });
// app.post('/',(req, res)=>{
//  res.status(200).send('You can POST to this endpoint....');
// });

//2.Routing
app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(globalErrorHandler);

//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTours);
//app.post('/api/v1/tours', createNewTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

// app.get('/api/v1/tours', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         total_tour: tours.length,
//         data: {
//             tours
//         }
//     });
// });

// app.get('/api/v1/tours/:id', (req, res) => {
//     console.log(req.params);
//     const id = req.params.id * 1;
//     // if (id > tours.length) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: "Invalid ID",
//     //     });
//     // }
//     const tour = tours.find(el => el.id === id);
//     if (!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID",
//         });
//     }
//     res.status(200).json({
//         status: 'success',
//         // total_tour: tours.length,
//         data: {
//             tour
//         }
//     });
// });
// app.post('/api/v1/tours', (req, res) => {
//     // console.log(req.body);
//     // res.send('Done');
//     const newID = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({
//         id: newID
//     }, req.body);
//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tours: newTour
//             }
//         })
//         console.log(err);
//     })
// });

// app.patch('/api/v1/tours/:id', (req, res) => {
//     if (req.params.id > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID",
//         });
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: '<Updated tour here>'
//         }
//     });
// });

// app.delete('/api/v1/tours/:id', (req, res) => {
//     if (req.params.id > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID",
//         });
//     }
//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

//3.Localhost

module.exports = app;