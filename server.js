const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});
process.on('uncaughtException', err => {
  console.log('Uncaughted Exception ! 💥. Shutting Down.');
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require('./app');

//console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  //.connect(DB, {
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    //eslint-disable-next-line no-console
    console.log('DB connection Successful');
  });

// const testTour = new Tour({
//   name: 'Om Santi om',
//   rating: 4.7,
//   price: 497
// });
// testTour
//   .save()
//   .then(doc => {
//     // eslint-disable-next-line no-console
//     console.log(doc);
//   })
//   .catch(err => {
//     // eslint-disable-next-line no-console
//     console.log('Error!💥', err);
//   });

const port = process.env.port || 3000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Your server is running on ${port}....👍`);
});
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ! 💥. Shutting Down.');
  server.close(() => {
    process.exit(1);
  });
});