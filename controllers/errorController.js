const AppError = require('../ultis/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `The name already exists: ${value} Please use another name`;
    return new AppError(message, 400)
}
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input Data. ${errors.join('. ')}`;
    return new AppError(message, 400)
}
const handleJWTError = err => new AppError('Invalid token please login again', 401);
const handleJWTExpiredError = err => new AppError('Your token has expired please login again!', 401);
const sendErrorDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // RENDERED WEBSITE
    console.error('Error 😢', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};
const sendErrorProd = (err, req, res) => {
    // a) API
    if (req.originalUrl.startsWith('/api')) {
        // Operational truste error : send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // Programming or other unknown errors: don't leak error details
        // 1) Log error
        console.error('Error 😢', err);

        //2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
    // B) RENDERED WEBSITE
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // Programming or other unknown errors: don't leak error details
    // 1) Log error
    console.error('Error 😢', err);
    //2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });

}
module.exports = (err, req, res, next) => {
    //console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = {
            ...err
        };
        error.message = err.message;
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

        sendErrorProd(error, req, res);
    }
}