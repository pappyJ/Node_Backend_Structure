const path = require('path');
const express = require('express');
const logger = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');

// ROUTERS
const viewRoutes = require('./routes/viewRoutes');

const globalErrorHandler = require('./Error/errorController');
const AppError = require('./Error/appError');
const app = express();

// GLOBAL MIDDLEWARES

// TEMPLATE ENGINE INITIALIZATION
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// DEVELOPMENT LOGGING
// if (process.env.NODE_ENV === 'development') {
//     app.use(logger('dev'));
// }

app.use(logger('dev'));

// BODY-PARSER, READING DATA FROM body INTO req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// SET SECURITY HEADERS
app.use(helmet());

// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// PREVENT PARAMETER POLLUTION
app.use(
    hpp({
        whitelist: []
    })
);

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// COMPRESSING TEXT RESPONSES
// app.use(compression()); // USED DURING PRODUCTION PHASE

app.use(cors());

app.use('/view', viewRoutes);

app.get('/', (req, res, next) => {
    res.status(200).send('<h1>Welcome to EDUSCHOOL</h1>');
});

app.all('*', (req, res, next) => {
    return next(
        new AppError(`Wrong url '${req.originalUrl}'. This url doesn't exist!`)
    );
});

app.use(globalErrorHandler);

module.exports = app;
