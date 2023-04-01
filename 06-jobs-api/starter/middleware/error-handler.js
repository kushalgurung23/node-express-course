// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err , req, res, next) => {

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }
  // 1. DUPLICATE ERROR VALIDATION
  if(err.code && err.code === 11000) {
     customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please provide unique value.`
     customError.statusCode = 400
  }
  // 2. MISSING FIELDS ERROR VALIDATION
  if(err.name ==="ValidationError") {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = 400
  }
  // 3. CAST ERROR VALIDATION
  if(err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg:customError.msg })
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
