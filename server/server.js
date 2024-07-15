const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
require('dotenv').config();  // Load environment variables from .env file

const auth = require('./routes/auth');
const cinema = require('./routes/cinema');
const theater = require('./routes/theater');
const movie = require('./routes/movie');
const showtime = require('./routes/showtime');

mongoose.set('strictQuery', false);

const dbUri = process.env.DATABASE_URL;
if (!dbUri) {
  throw new Error('DATABASE environment variable not set.');
}

mongoose
  .connect(dbUri, { autoIndex: true })
  .then(() => {
    console.log('Mongoose connected!');
  })
  .catch((err) => console.log('Mongoose connection error:', err));

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

app.use('/auth', auth);
app.use('/cinema', cinema);
app.use('/theater', theater);
app.use('/movie', movie);
app.use('/showtime', showtime);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
