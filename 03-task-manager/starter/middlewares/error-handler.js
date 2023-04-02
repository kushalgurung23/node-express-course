const {CustomError} = require('../errors/custom-error')

// try catch built-in error

const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof CustomError) {
        return res.status(err.statusCode).json({msg: err.message});
    }
    console.log('no instance');
    return res.status(500).json({msg: 'Something went wrong. Please try again.'})
}

module.exports = errorHandlerMiddleware