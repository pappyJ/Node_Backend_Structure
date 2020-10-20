const AppError = require('./appError');

// CAST ERROR (INVALID VALUE)
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} - ${err.value}`;
    return new AppError(message, 400);
};

// DUPLICATE ERROR (MORE THAN ONE VALUE)
const handleDuplicateErrorDB = err => {
    const errorKeys = Object.keys(err.keyValue);
    const message = `Duplicate field value: ${
        err.keyValue[errorKeys[0]]
    } already exist. Please use another value`;

    return new AppError(message, 400);
};

// VALIDATION ERROR (VALUE DOESN'T MATCH EXPECTED VALUE)
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid Input Data: ${errors
        .join('. ')
        .replace(/"/g, `'`)}`;

    return new AppError(message, 400);
};

// JSON INVALID TOKEN
const handleJWTError = () => new AppError('Invalid Token. Please Log In.', 401);

// JSON EXPIRED TOKEN
const handleTokenExpiredError = () =>
    new AppError('Token has expired!. Please Log In Again', 401);

// Error Controllers

// DEVELOPMENT ENVIRONMENT ERROR HANDLER
const sendErrDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    return res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        message: err.message
    });
};

// PRODUCTION ENVIRONMENT ERROR HANDLER
const sendErrProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }

    const message = err.isOperational ? err.message : 'Please Try Again Later!';

    return res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        message
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.__proto__ = err;

        if (error.name === 'CastError') error = handleCastErrorDB(error);

        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        if (error.code === 11000) error = handleDuplicateErrorDB(error);

        if (error.name === 'JsonWebTokenError') error = handleJWTError();

        if (error.name === 'TokenExpiredError')
            error = handleTokenExpiredError();

        sendErrProd(error, req, res);
    }
};
